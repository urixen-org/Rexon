package main_test

import (
	"rexon/sql"
	"testing"
)

func TestSettings(t *testing.T) {
	// Initialize DB
	sql.Init("./data.rexon")
	defer sql.Close() // safely close after test

	// Set a value
	//sql.SetValue("passcode", "123456")

	// Get the value
	passcode := sql.GetValue("passcode")

	if passcode != "132143" {
		t.Errorf("Expected passcode to be '132143', got '%s'", passcode)
	}
}
