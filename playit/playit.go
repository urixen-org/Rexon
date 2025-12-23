package playit

/*
#cgo LDFLAGS: -LE:\rexon\playit-agent\target\release -lplayit_control
#include "E:\rexon\playit-agent\packages\playit_control\include\playitctl.h"
*/
import "C"
import (
	"fmt"
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
//
// Parameters:
//   - apiBase: Base URL for the Playit API (e.g., "https://api.playit.gg")
//   - secret: Agent or account secret for authentication
//
// Returns:
//   - *PlayitCtl: Pointer to the created instance
//   - error: Error if creation failed
//
// Note: Caller must call Close() when done to avoid memory leaks
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
//
// Returns:
//   - string: Agent UUID if found
//   - error: Error if discovery failed or no agent found
//
// Note: This function blocks while making API calls
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
//
// This attempts to create a tunnel using the best available method:
//   - First tries paid-tier default origin
//   - Falls back to agent origin if needed
//   - Falls back to free-tier game-specific tunnels if needed
//
// Parameters:
//   - name: Optional tunnel name (empty string for auto-generated)
//   - localIP: Local IP address to forward to (e.g., "127.0.0.1")
//   - localPort: Local port number to forward to
//
// Returns:
//   - string: Tunnel UUID on success
//   - error: Error if creation failed
//
// Note: This function blocks while making API calls
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
//
// Parameters:
//   - tunnelUUID: UUID string of the tunnel to delete
//
// Returns:
//   - error: Error if deletion failed
//
// Note: This function blocks while making API calls
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
//
// This polls the API until the tunnel gets an assigned address or the timeout expires.
//
// Parameters:
//   - tunnelUUID: UUID string of the tunnel to wait for
//   - timeout: Maximum time to wait
//
// Returns:
//   - string: Assigned address (e.g., "example.playit.gg:12345")
//   - error: Error if timeout or other failure
//
// Note: This function blocks for up to timeout duration and polls every 2 seconds
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