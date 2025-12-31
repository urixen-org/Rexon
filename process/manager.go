package process

import (
	"bufio"
	"context"
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"sync"
	"time"
)

type Manager struct {
	mu        sync.RWMutex
	cmd       *exec.Cmd
	stdin     io.WriteCloser
	logFile   *os.File
	sessionID string
	cancel    context.CancelFunc
	done      chan struct{}
	logBroker *LogBroker
	stopping  bool
}

type LogBroker struct {
	mu          sync.RWMutex
	subscribers map[chan string]struct{}
}

func NewLogBroker() *LogBroker {
	return &LogBroker{
		subscribers: make(map[chan string]struct{}),
	}
}

func (b *LogBroker) Subscribe() chan string {
	b.mu.Lock()
	defer b.mu.Unlock()

	ch := make(chan string, 100)
	b.subscribers[ch] = struct{}{}
	return ch
}

func (b *LogBroker) Unsubscribe(ch chan string) {
	b.mu.Lock()
	defer b.mu.Unlock()

	if _, exists := b.subscribers[ch]; exists {
		delete(b.subscribers, ch)
		close(ch)
	}
}

func (b *LogBroker) Broadcast(line string) {
	b.mu.RLock()
	defer b.mu.RUnlock()

	for ch := range b.subscribers {
		select {
		case ch <- line:
		default:
			// i am here to just say: "I am doing nothing"
		}
	}
}

func (b *LogBroker) Close() {
	b.mu.Lock()
	defer b.mu.Unlock()

	for ch := range b.subscribers {
		close(ch)
		delete(b.subscribers, ch)
	}
}

func NewManager() *Manager {
	return &Manager{}
}

func (m *Manager) Start(command string, args ...string) (string, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.cmd != nil {
		return "", errors.New("process already running")
	}

	if m.stopping {
		return "", errors.New("process is still stopping")
	}

	m.sessionID = strconv.Itoa(m.cmd.Process.Pid)
	logPath := filepath.Join("logs", m.sessionID+".log")

	if err := os.MkdirAll("logs", 0755); err != nil {
		return "", fmt.Errorf("failed to create logs directory: %w", err)
	}

	f, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		return "", fmt.Errorf("failed to create log file: %w", err)
	}
	m.logFile = f
	m.logBroker = NewLogBroker()

	ctx, cancel := context.WithCancel(context.Background())
	m.cancel = cancel
	m.done = make(chan struct{})

	cmd := exec.CommandContext(ctx, command, args...)
	cmd.Dir = "server"

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		f.Close()
		cancel()
		return "", fmt.Errorf("failed to get stdout pipe: %w", err)
	}

	stderr, err := cmd.StderrPipe()
	if err != nil {
		f.Close()
		cancel()
		return "", fmt.Errorf("failed to get stderr pipe: %w", err)
	}

	stdin, err := cmd.StdinPipe()
	if err != nil {
		f.Close()
		cancel()
		return "", fmt.Errorf("failed to get stdin pipe: %w", err)
	}
	m.stdin = stdin

	if err := cmd.Start(); err != nil {
		f.Close()
		cancel()
		return "", fmt.Errorf("failed to start process: %w", err)
	}
	m.cmd = cmd

	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		defer wg.Done()
		m.readOutput(stdout, "STDOUT")
	}()

	go func() {
		defer wg.Done()
		m.readOutput(stderr, "STDERR")
	}()

	go func() {
		wg.Wait()
		m.cmd.Wait()

		m.mu.Lock()
		if m.logBroker != nil {
			m.logBroker.Close()
		}
		m.mu.Unlock()

		close(m.done)
	}()

	return m.sessionID, nil
}

func (m *Manager) readOutput(r io.Reader, prefix string) {
	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		line := scanner.Text()
		timestamp := time.Now().Format("15:04:05")
		formattedLine := fmt.Sprintf("[%s] [%s] %s", timestamp, prefix, line)

		m.mu.RLock()
		if m.logFile != nil {
			m.logFile.WriteString(formattedLine + "\n")
			m.logFile.Sync()
		}
		if m.logBroker != nil {
			m.logBroker.Broadcast(formattedLine)
		}
		m.mu.RUnlock()
	}
}

func (m *Manager) Stop() error {
	m.mu.Lock()

	if m.cmd == nil {
		m.mu.Unlock()
		return errors.New("no process running")
	}

	if m.stopping {
		m.mu.Unlock()
		return errors.New("process already stopping")
	}

	m.stopping = true

	if m.stdin != nil {
		m.stdin.Write([]byte("stop\n"))
	}

	cmd := m.cmd
	stdin := m.stdin
	logFile := m.logFile
	cancel := m.cancel
	done := m.done
	logBroker := m.logBroker

	m.stdin = nil
	m.sessionID = ""

	m.mu.Unlock()

	gracefulStop := make(chan struct{})
	go func() {
		<-done
		close(gracefulStop)
	}()

	select {
	case <-gracefulStop:
	case <-time.After(5 * time.Second):
		if cmd.Process != nil {
			cmd.Process.Kill()
		}
		<-done
	}

	if stdin != nil {
		stdin.Close()
	}
	if logFile != nil {
		logFile.Close()
	}
	if cancel != nil {
		cancel()
	}
	if logBroker != nil {
		logBroker.Close()
	}

	m.mu.Lock()
	m.cmd = nil
	m.cancel = nil
	m.done = nil
	m.logBroker = nil
	m.stopping = false
	m.mu.Unlock()

	logPath := m.logFile.Name()
	if err := os.Remove(filepath.Join(m.logFile.Name())); err != nil {
		fmt.Printf("Failed to delete log file %s: %v\n", logPath, err)
	}
	m.logFile = nil
	return nil
}

func (m *Manager) Write(input string) error {
	m.mu.RLock()
	stdin := m.stdin
	stopping := m.stopping
	m.mu.RUnlock()

	if stdin == nil || stopping {
		return errors.New("process not running or stdin closed")
	}

	_, err := stdin.Write([]byte(input + "\n"))
	if err != nil {
		return fmt.Errorf("failed to write to stdin: %w", err)
	}

	return nil
}

func (m *Manager) IsRunning() bool {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.cmd != nil
}

func (m *Manager) GetSessionID() string {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.sessionID
}

func (m *Manager) Subscribe() (chan string, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	if m.logBroker == nil {
		return nil, errors.New("no process running")
	}

	return m.logBroker.Subscribe(), nil
}

func (m *Manager) Unsubscribe(ch chan string) {
	m.mu.RLock()
	broker := m.logBroker
	m.mu.RUnlock()

	if broker != nil {
		broker.Unsubscribe(ch)
	}
}
