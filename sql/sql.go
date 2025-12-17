package sql

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

type DB struct {
	conn *sql.DB
}

var db *DB

// Init initializes the database (singleton)
func Init(path string) {
	if db != nil {
		return // already initialized
	}

	conn, err := sql.Open("sqlite3", path)
	if err != nil {
		panic(fmt.Errorf("failed to open database: %w", err))
	}

	conn.SetMaxOpenConns(1) // optional

	db = &DB{conn: conn}

	// Create settings table
	_, err = db.conn.Exec(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT NOT NULL UNIQUE,
            value TEXT NOT NULL
        );
    `)
	if err != nil {
		panic(fmt.Errorf("failed to create table: %w", err))
	}
}

// Close safely closes the database
func Close() {
	if db != nil && db.conn != nil {
		db.conn.Close()
		db = nil
	}
}

// GetValue fetches a value from the settings table
func GetValue(key string) string {
	if db == nil {
		panic("database not initialized")
	}

	var value string
	err := db.conn.QueryRow("SELECT value FROM settings WHERE key = ?", key).Scan(&value)
	if err != nil && err != sql.ErrNoRows {
		panic(err)
	}
	return value
}

// SetValue inserts or updates a key/value pair
func SetValue(key, value string) {
	if db == nil {
		panic("database not initialized")
	}

	_, err := db.conn.Exec(
		`INSERT INTO settings (key, value) VALUES (?, ?)
		 ON CONFLICT(key) DO UPDATE SET value = ?`,
		key, value, value,
	)
	if err != nil {
		panic(err)
	}
}
