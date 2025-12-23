package main

import (
	"encoding/json"
	"fmt"
	"rexon/playit"
)

func main() {
	claimCode := "frustend2"
	agentType := "self-managed"
	version := "0.16.5"

	var data []byte
	var err any

	resp := ClaimCode(claimCode, agentType, version)
	fmt.Println(resp.Data.SecretKey)
	client := playit.NewClient(resp.Data.SecretKey)
	data, err = client.GetAgentRunData()
	fmt.Println(string(data))
	fmt.Println(err)
	
	//data, err = client.CreateTunnel("java-demo", "minecraft-java", "tcp", int(1), "f3234c86-8885-44ce-a0b0-08a9e0b72946", "0.0.0.0", int(25565), true)

	//fmt.Println(string(data))
	//fmt.Println(err)

}
func ClaimCode(claimCode, agentType, version string) playit.UnifiedResponse {
	client := playit.NewUnauthenticatedClient()

	data, err := client.SetupClaim(claimCode, agentType, version)
	if err != nil {
		fmt.Println("setup error:", err)
	}

	var resp struct {
		Data string `json:"data"`
	}

	json.Unmarshal(data, &resp)

	if resp.Data == "WaitingForUserVisit" {
		fmt.Printf("Visit: https://playit.gg/claim/%s\n", claimCode)
	}

	for {
		status, err := client.SetupClaim(claimCode, agentType, version)
		if err != nil {
			continue
		}

		json.Unmarshal(status, &resp)

		if resp.Data == "UserAccepted" {
			fmt.Println("Claim accepted")
			var unified playit.UnifiedResponse
			data, _ := client.ExchangeClaim(claimCode)
			fmt.Println(string(data))
			json.Unmarshal(data, &unified)
			_, _ = client.RegisterProto("linux", version, false, false, 1, "0.0.0.0:4000", "0.0.0.0:4001")
			return unified

		}
	}
	return playit.UnifiedResponse{}
}
