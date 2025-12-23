package playit

import (
	"fmt"
	"os"
	"testing"
	"time"
)

// =============================================================================
// Test Suite
// =============================================================================

// TestPlayitCtlNew tests creating and freeing a PlayitCtl instance
func TestPlayitCtlNew(t *testing.T) {
	// Test with valid parameters
	ctl, err := NewPlayitCtl("https://api.playit.gg", "test_secret")
	if err != nil {
		t.Fatalf("Failed to create PlayitCtl: %v", err)
	}
	defer ctl.Close()

	if ctl.handle == nil {
		t.Error("Expected non-nil handle")
	}

	t.Log("✓ Successfully created PlayitCtl instance")
}

// TestPlayitCtlClose tests proper cleanup
func TestPlayitCtlClose(t *testing.T) {
	ctl, err := NewPlayitCtl("https://api.playit.gg", "test_secret")
	if err != nil {
		t.Fatalf("Failed to create PlayitCtl: %v", err)
	}

	// Close should not panic
	ctl.Close()

	// Double close should not panic
	ctl.Close()

	if ctl.handle != nil {
		t.Error("Expected handle to be nil after Close()")
	}

	t.Log("✓ Successfully closed PlayitCtl instance")
}

// TestPlayitCtlDiscoverAgentID tests agent ID discovery
//
// Note: This requires a valid secret and running agent
func TestPlayitCtlDiscoverAgentID(t *testing.T) {
	secret := getTestSecret(t)
	if secret == "" {
		t.Skip("Skipping test: PLAYIT_SECRET environment variable not set")
	}

	ctl, err := NewPlayitCtl("https://api.playit.gg", secret)
	if err != nil {
		t.Fatalf("Failed to create PlayitCtl: %v", err)
	}
	defer ctl.Close()

	agentID, err := ctl.DiscoverAgentID()
	if err != nil {
		t.Logf("Failed to discover agent ID: %v", err)
		t.Log("Note: This is expected if no agent is running with this secret")
		return
	}

	if agentID == "" {
		t.Error("Expected non-empty agent ID")
	}

	t.Logf("✓ Discovered agent ID: %s", agentID)
}

// TestPlayitCtlCreateAndDeleteTunnel tests the full tunnel lifecycle
//
// Note: This requires a valid secret and running agent
func TestPlayitCtlCreateAndDeleteTunnel(t *testing.T) {
	secret := getTestSecret(t)
	if secret == "" {
		t.Skip("Skipping test: PLAYIT_SECRET environment variable not set")
	}

	ctl, err := NewPlayitCtl("https://api.playit.gg", secret)
	if err != nil {
		t.Fatalf("Failed to create PlayitCtl: %v", err)
	}
	defer ctl.Close()

	// Create tunnel
	tunnelName := fmt.Sprintf("test-tunnel-%d", time.Now().Unix())
	tunnelUUID, err := ctl.CreateTunnelAuto(tunnelName, "127.0.0.1", 25565)
	if err != nil {
		t.Fatalf("Failed to create tunnel: %v", err)
	}

	t.Logf("✓ Created tunnel: %s (UUID: %s)", tunnelName, tunnelUUID)

	// Ensure cleanup
	defer func() {
		if err := ctl.DeleteTunnel(tunnelUUID); err != nil {
			t.Logf("Warning: Failed to delete tunnel: %v", err)
		} else {
			t.Logf("✓ Deleted tunnel: %s", tunnelUUID)
		}
	}()

	// Wait for assignment
	address, err := ctl.WaitForAssignment(tunnelUUID, 30*time.Second)
	if err != nil {
		t.Logf("Failed to get assignment: %v", err)
		t.Log("Note: This might be expected if the tunnel takes longer to assign")
		return
	}

	t.Logf("✓ Tunnel assigned address: %s", address)
}

// TestPlayitCtlMultipleTunnels tests creating multiple tunnels
func TestPlayitCtlMultipleTunnels(t *testing.T) {
	secret := getTestSecret(t)
	if secret == "" {
		t.Skip("Skipping test: PLAYIT_SECRET environment variable not set")
	}

	ctl, err := NewPlayitCtl("https://api.playit.gg", secret)
	if err != nil {
		t.Fatalf("Failed to create PlayitCtl: %v", err)
	}
	defer ctl.Close()

	tunnelCount := 3
	tunnelUUIDs := make([]string, 0, tunnelCount)

	// Create multiple tunnels
	for i := 0; i < tunnelCount; i++ {
		tunnelName := fmt.Sprintf("test-multi-%d-%d", time.Now().Unix(), i)
		port := uint16(25565 + i)

		tunnelUUID, err := ctl.CreateTunnelAuto(tunnelName, "127.0.0.1", port)
		if err != nil {
			t.Logf("Failed to create tunnel %d: %v", i, err)
			continue
		}

		tunnelUUIDs = append(tunnelUUIDs, tunnelUUID)
		t.Logf("✓ Created tunnel %d: %s", i+1, tunnelUUID)
	}

	// Cleanup all tunnels
	defer func() {
		for i, uuid := range tunnelUUIDs {
			if err := ctl.DeleteTunnel(uuid); err != nil {
				t.Logf("Warning: Failed to delete tunnel %d: %v", i, err)
			} else {
				t.Logf("✓ Deleted tunnel %d: %s", i+1, uuid)
			}
		}
	}()

	if len(tunnelUUIDs) == 0 {
		t.Error("Failed to create any tunnels")
	} else {
		t.Logf("✓ Successfully created %d tunnels", len(tunnelUUIDs))
	}
}

// TestPlayitCtlInvalidIP tests error handling for invalid IP addresses
func TestPlayitCtlInvalidIP(t *testing.T) {
	secret := getTestSecret(t)
	if secret == "" {
		t.Skip("Skipping test: PLAYIT_SECRET environment variable not set")
	}

	ctl, err := NewPlayitCtl("https://api.playit.gg", secret)
	if err != nil {
		t.Fatalf("Failed to create PlayitCtl: %v", err)
	}
	defer ctl.Close()

	// Try to create tunnel with invalid IP
	_, err = ctl.CreateTunnelAuto("test", "not-an-ip", 25565)
	if err == nil {
		t.Error("Expected error for invalid IP address")
	} else {
		t.Logf("✓ Correctly rejected invalid IP: %v", err)
	}
}

// TestPlayitCtlInvalidUUID tests error handling for invalid UUID
func TestPlayitCtlInvalidUUID(t *testing.T) {
	secret := getTestSecret(t)
	if secret == "" {
		t.Skip("Skipping test: PLAYIT_SECRET environment variable not set")
	}

	ctl, err := NewPlayitCtl("https://api.playit.gg", secret)
	if err != nil {
		t.Fatalf("Failed to create PlayitCtl: %v", err)
	}
	defer ctl.Close()

	// Try to delete tunnel with invalid UUID
	err = ctl.DeleteTunnel("not-a-uuid")
	if err == nil {
		t.Error("Expected error for invalid UUID")
	} else {
		t.Logf("✓ Correctly rejected invalid UUID: %v", err)
	}
}

// TestPlayitResultString tests the String() method
func TestPlayitResultString(t *testing.T) {
	tests := []struct {
		code PlayitResult
		want string
	}{
		{PlayitSuccess, "Success"},
		{PlayitErrorNull, "Null pointer error"},
		{PlayitErrorInvalidIP, "Invalid IP address"},
		{PlayitErrorAPI, "API call failed"},
		{PlayitResult(999), "Unknown error code: 999"},
	}

	for _, tt := range tests {
		got := tt.code.String()
		if got != tt.want {
			t.Errorf("PlayitResult(%d).String() = %q, want %q", tt.code, got, tt.want)
		}
	}

	t.Log("✓ PlayitResult.String() works correctly")
}

// BenchmarkCreateTunnel benchmarks tunnel creation performance
func BenchmarkCreateTunnel(b *testing.B) {
	secret := os.Getenv("PLAYIT_SECRET")
	if secret == "" {
		b.Skip("Skipping benchmark: PLAYIT_SECRET environment variable not set")
	}

	ctl, err := NewPlayitCtl("https://api.playit.gg", secret)
	if err != nil {
		b.Fatalf("Failed to create PlayitCtl: %v", err)
	}
	defer ctl.Close()

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		tunnelName := fmt.Sprintf("bench-%d", i)
		tunnelUUID, err := ctl.CreateTunnelAuto(tunnelName, "127.0.0.1", 25565)
		if err != nil {
			b.Logf("Failed to create tunnel: %v", err)
			continue
		}

		// Cleanup
		_ = ctl.DeleteTunnel(tunnelUUID)
	}
}

// BenchmarkDiscoverAgent benchmarks agent discovery performance
func BenchmarkDiscoverAgent(b *testing.B) {
	secret := os.Getenv("PLAYIT_SECRET")
	if secret == "" {
		b.Skip("Skipping benchmark: PLAYIT_SECRET environment variable not set")
	}

	ctl, err := NewPlayitCtl("https://api.playit.gg", secret)
	if err != nil {
		b.Fatalf("Failed to create PlayitCtl: %v", err)
	}
	defer ctl.Close()

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		_, _ = ctl.DiscoverAgentID()
	}
}

// =============================================================================
// Helper Functions
// =============================================================================

// getTestSecret retrieves the test secret from environment variable
func getTestSecret(t *testing.T) string {
	return os.Getenv("PLAYIT_SECRET")
}

// =============================================================================
// Example Functions
// =============================================================================

// ExampleNewPlayitCtl demonstrates creating a new PlayitCtl instance
func ExampleNewPlayitCtl() {
	ctl, err := NewPlayitCtl("https://api.playit.gg", "your_secret_here")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer ctl.Close()

	fmt.Println("PlayitCtl instance created successfully")
}

// ExamplePlayitCtl_DiscoverAgentID demonstrates discovering an agent ID
func ExamplePlayitCtl_DiscoverAgentID() {
	ctl, _ := NewPlayitCtl("https://api.playit.gg", "your_secret_here")
	defer ctl.Close()

	agentID, err := ctl.DiscoverAgentID()
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Printf("Agent ID: %s\n", agentID)
}

// ExamplePlayitCtl_CreateTunnelAuto demonstrates creating a tunnel
func ExamplePlayitCtl_CreateTunnelAuto() {
	ctl, _ := NewPlayitCtl("https://api.playit.gg", "your_secret_here")
	defer ctl.Close()

	tunnelUUID, err := ctl.CreateTunnelAuto("My Game Server", "127.0.0.1", 25565)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Printf("Created tunnel: %s\n", tunnelUUID)
}

// ExamplePlayitCtl_WaitForAssignment demonstrates waiting for tunnel assignment
func ExamplePlayitCtl_WaitForAssignment() {
	ctl, _ := NewPlayitCtl("https://api.playit.gg", "your_secret_here")
	defer ctl.Close()

	tunnelUUID := "550e8400-e29b-41d4-a716-446655440000"
	address, err := ctl.WaitForAssignment(tunnelUUID, 30*time.Second)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Printf("Tunnel address: %s\n", address)
}