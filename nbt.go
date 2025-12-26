package main

import (
	"encoding/json"
	"fmt"
	"log"

	"rexon/mc"
)

func main() {
	worldPath := "server/world"

	players, err := mc.LoadAllPlayers(worldPath)
	if err != nil {
		log.Fatal(err)
	}

	for _, p := range players {
		fmt.Printf("==== Player %d ====\n", p["name"])
		if name, ok := p["Name"].(string); ok {
			fmt.Printf("Name: %s\n", name)
		}
		pretty, _ := json.MarshalIndent(p, "", "  ")
		fmt.Println(string(pretty))
	}
}
