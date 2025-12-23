package main

/*
#cgo LDFLAGS: -L./playit-agent/target/release -lplayit_control
#include "./playit-agent/packages/playit_control/include/playitctl.h"
#include <stdlib.h>
*/
import "C"
import (
	"bufio"
	"fmt"
	"os"
	"time"
	"unsafe"
)

// PlayitResult represents the result codes from the C library
type PlayitResult int

const (
	PlayitSuccess          PlayitResult = 0
	PlayitErrorNull        PlayitResult = 1
	PlayitErrorInvalidUTF8 PlayitResult = 2
	PlayitErrorInvalidIP   PlayitResult = 3
	PlayitErrorInvalidUUID PlayitResult = 4
	PlayitErrorAPI         PlayitResult = 5
	PlayitErrorTimeout     PlayitResult = 6
	PlayitErrorNoAgent     PlayitResult = 7
	PlayitErrorUnknown     PlayitResult = 99
)

// String returns a human-readable description of the result code
func (r PlayitResult) String() string {
	switch r {
	case PlayitSuccess:
		return "Success"
	case PlayitErrorNull:
		return "Null pointer error"
	case PlayitErrorInvalidUTF8:
		return "Invalid UTF-8 string"
	case PlayitErrorInvalidIP:
		return "Invalid IP address"
	case PlayitErrorInvalidUUID:
		return "Invalid UUID"
	case PlayitErrorAPI:
		return "API call failed"
	case PlayitErrorTimeout:
		return "Operation timed out"
	case PlayitErrorNoAgent:
		return "No agent discovered"
	case PlayitErrorUnknown:
		return "Unknown error"
	default:
		return fmt.Sprintf("Unknown error code: %d", r)
	}
}

// PlayitCtl wraps the C PlayitCtlHandle and provides a Go-friendly interface
type PlayitCtl struct {
	handle *C.PlayitCtlHandle
}

// NewPlayitCtl creates a new PlayitCtl instance
func NewPlayitCtl(apiBase, secret string) (*PlayitCtl, error) {
	cApiBase := C.CString(apiBase)
	defer C.free(unsafe.Pointer(cApiBase))

	cSecret := C.CString(secret)
	defer C.free(unsafe.Pointer(cSecret))

	handle := C.playit_ctl_new(cApiBase, cSecret)
	if handle == nil {
		return nil, fmt.Errorf("failed to create PlayitCtl instance")
	}

	return &PlayitCtl{handle: handle}, nil
}

// Close frees the PlayitCtl instance and all associated resources
func (p *PlayitCtl) Close() {
	if p.handle != nil {
		C.playit_ctl_free(p.handle)
		p.handle = nil
	}
}

// DiscoverAgentID discovers the agent ID associated with this account/secret
func (p *PlayitCtl) DiscoverAgentID() (string, error) {
	if p.handle == nil {
		return "", fmt.Errorf("PlayitCtl instance is closed")
	}

	cUUID := C.playit_ctl_discover_agent_id(p.handle)
	if cUUID == nil {
		return "", fmt.Errorf("no agent ID discovered")
	}
	defer C.playit_free_string(cUUID)

	return C.GoString(cUUID), nil
}

// CreateTunnelAuto creates a tunnel using automatic fallback logic
func (p *PlayitCtl) CreateTunnelAuto(name, localIP string, localPort uint16) (string, error) {
	if p.handle == nil {
		return "", fmt.Errorf("PlayitCtl instance is closed")
	}

	var cName *C.char
	if name != "" {
		cName = C.CString(name)
		defer C.free(unsafe.Pointer(cName))
	}

	cLocalIP := C.CString(localIP)
	defer C.free(unsafe.Pointer(cLocalIP))

	var cResultUUID *C.char
	result := C.playit_ctl_create_tunnel_auto(
		p.handle,
		cName,
		cLocalIP,
		C.uint16_t(localPort),
		&cResultUUID,
	)

	if result != C.PLAYIT_SUCCESS {
		return "", fmt.Errorf("failed to create tunnel: %s", PlayitResult(result))
	}

	if cResultUUID == nil {
		return "", fmt.Errorf("tunnel created but UUID is null")
	}
	defer C.playit_free_string(cResultUUID)

	return C.GoString(cResultUUID), nil
}

// DeleteTunnel deletes a tunnel by its UUID
func (p *PlayitCtl) DeleteTunnel(tunnelUUID string) error {
	if p.handle == nil {
		return fmt.Errorf("PlayitCtl instance is closed")
	}

	cUUID := C.CString(tunnelUUID)
	defer C.free(unsafe.Pointer(cUUID))

	result := C.playit_ctl_delete_tunnel(p.handle, cUUID)
	if result != C.PLAYIT_SUCCESS {
		return fmt.Errorf("failed to delete tunnel: %s", PlayitResult(result))
	}

	return nil
}

// WaitForAssignment waits for a tunnel to be assigned a public address
func (p *PlayitCtl) WaitForAssignment(tunnelUUID string, timeout time.Duration) (string, error) {
	if p.handle == nil {
		return "", fmt.Errorf("PlayitCtl instance is closed")
	}

	cUUID := C.CString(tunnelUUID)
	defer C.free(unsafe.Pointer(cUUID))

	timeoutSecs := C.uint64_t(timeout.Seconds())
	cAddress := C.playit_ctl_wait_for_assignment(p.handle, cUUID, timeoutSecs)
	if cAddress == nil {
		return "", fmt.Errorf("timeout waiting for tunnel assignment")
	}
	defer C.playit_free_string(cAddress)

	return C.GoString(cAddress), nil
}

// =============================================================================
// Main Program - Mimics your Rust example
// =============================================================================

func main() {
	fmt.Println("===========================================")
	fmt.Println("  Playit Tunnel Control - Go Demo")
	fmt.Println("===========================================")
	fmt.Println()

	// Read secret from env or first CLI arg (just like your Rust version)
	secret := os.Getenv("PLAYIT_SECRET")
	if secret == "" && len(os.Args) > 1 {
		secret = os.Args[1]
	}

	if secret == "" {
		fmt.Println("❌ PLAYIT_SECRET not set and no secret passed as first argument.")
		fmt.Println()
		fmt.Println("Obtain a writable secret (claim flow) and either:")
		fmt.Println("  export PLAYIT_SECRET=your_secret")
		fmt.Println("  OR pass it as the first argument:")
		fmt.Println("  go run main.go your_secret")
		fmt.Println()
		os.Exit(1)
	}

	// Optional overrides via env (LOCAL_IP, LOCAL_PORT)
	localIP := os.Getenv("LOCAL_IP")
	if localIP == "" {
		localIP = "127.0.0.1"
	}

	localPort := 25565
	if portStr := os.Getenv("LOCAL_PORT"); portStr != "" {
		fmt.Sscanf(portStr, "%d", &localPort)
	}

	apiBase := "https://api.playit.gg"

	// Create controller
	fmt.Println("📡 Creating Playit controller...")
	ctl, err := NewPlayitCtl(apiBase, secret)
	if err != nil {
		fmt.Printf("❌ Failed to create PlayitCtl: %v\n", err)
		os.Exit(1)
	}
	defer ctl.Close()

	fmt.Println("✅ Controller created")
	fmt.Println()

	// Discover agent ID
	fmt.Println("🔍 Discovering agent ID for this account/secret...")
	agentID, err := ctl.DiscoverAgentID()
	if err != nil {
		fmt.Printf("❌ No agent ID discovered: %v\n", err)
		fmt.Println()
		fmt.Println("💡 Make sure an agent using the same secret is running and connected.")
		fmt.Println("   Start the agent separately with:")
		fmt.Println("   playit --secret your_secret")
		fmt.Println()
		os.Exit(1)
	}

	fmt.Printf("✅ Using agent ID: %s\n", agentID)
	fmt.Println()

	// Create tunnel
	fmt.Printf("🚇 Attempting to create tunnel (local %s:%d)...\n", localIP, localPort)
	tunnelName := "go-demo"
	
	tunnelUUID, err := ctl.CreateTunnelAuto(tunnelName, localIP, uint16(localPort))
	if err != nil {
		fmt.Printf("❌ Failed to create tunnel: %v\n", err)
		fmt.Println()
		fmt.Println("💡 This could mean:")
		fmt.Println("   - The agent is not running")
		fmt.Println("   - The secret doesn't have permission")
		fmt.Println("   - The account has reached tunnel limits")
		fmt.Println()
		os.Exit(1)
	}

	fmt.Printf("✅ Created tunnel ID: %s\n", tunnelUUID)
	fmt.Println()

	// Ensure cleanup on exit
	defer func() {
		fmt.Printf("🧹 Deleting tunnel %s...\n", tunnelUUID)
		if err := ctl.DeleteTunnel(tunnelUUID); err != nil {
			fmt.Printf("⚠️  Failed to delete tunnel: %v\n", err)
		} else {
			fmt.Println("✅ Deleted.")
		}
		time.Sleep(1 * time.Second)
	}()

	// Wait for assignment
	fmt.Println("⏳ Waiting up to 60s for the tunnel to be assigned a public address...")
	address, err := ctl.WaitForAssignment(tunnelUUID, 60*time.Second)
	if err != nil {
		fmt.Printf("⚠️  Tunnel didn't get assigned within 60s: %v\n", err)
		fmt.Println("   Ensure the agent is running and able to allocate.")
		fmt.Println()
	} else {
		fmt.Printf("✅ Tunnel assigned at: %s\n", address)
		fmt.Println("   You can connect to your service using this address!")
		fmt.Println()
	}

	// Display info
	fmt.Println("===========================================")
	if address != "" {
		fmt.Printf("🎉 Public Address: %s\n", address)
	}
	fmt.Printf("📋 Tunnel UUID:    %s\n", tunnelUUID)
	fmt.Printf("🤖 Agent ID:       %s\n", agentID)
	fmt.Printf("🏠 Local:          %s:%d\n", localIP, localPort)
	fmt.Println("===========================================")
	fmt.Println()

	// Wait for user to press Enter (like your Rust version)
	fmt.Println("Tunnel will be kept until you press Enter.")
	fmt.Println("Press Enter to delete it and exit...")
	
	reader := bufio.NewReader(os.Stdin)
	reader.ReadString('\n')
	
	fmt.Println()
}