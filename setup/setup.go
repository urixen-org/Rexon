package setup

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"regexp"
	"rexon/ancii"
	"rexon/java"
	"rexon/playit"
	"rexon/sql"
	"rexon/utils"
	"runtime"
	"strings"
	"time"

	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/x/term"
)

func Setup(skipTo int) {
	ancii.PrintNoInput()
	sql.Init(utils.GetRexonPath() + "/data.rexon")
	defer sql.Close()

	step := 0
	if skipTo > 0 {
		step = skipTo
	}

	re := regexp.MustCompile(`^\d{6}$`)

	title := lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("10"))
	muted := lipgloss.NewStyle().Foreground(lipgloss.Color("8"))
	box := lipgloss.NewStyle().Border(lipgloss.RoundedBorder()).BorderForeground(lipgloss.Color("10")).Padding(1, 2).Width(50)
	renderBox := func(content string) { fmt.Println(box.Render(content)) }
	reader := bufio.NewReader(os.Stdin)

	if step <= 0 {
		if sql.GetValue("passcode") != "" {
			renderBox(title.Render("Rexon Panel Setup") + "\n\n" +
				muted.Render("Looks like you already have a passcode.\nUpdate your 6-digit passcode to secure your panel \n step: 0"))
		} else {
			renderBox(title.Render("Rexon Panel Setup") + "\n\n" +
				muted.Render("Create a 6-digit passcode to secure your panel"))
		}

		var passcode string
		for {
			renderBox("Create passcode (6 digits)")
			fmt.Print("› ")
			first := readHidden()
			if !re.MatchString(first) {
				renderBox("Passcode must be exactly 6 digits")
				continue
			}

			renderBox("Confirm passcode")
			fmt.Print("› ")
			second := readHidden()
			if first != second {
				renderBox("Passcodes do not match. Try again.")
				continue
			}

			passcode = first
			break
		}

		sql.SetValue("passcode", passcode)
		step++
	}

	if step <= 1 {
		renderBox("Do you want to expose your panel using ngrok? (y/n) \n step: 1")
		fmt.Print("› ")
		choiceRaw, _ := reader.ReadString('\n')
		choice := strings.ToLower(strings.TrimSpace(choiceRaw))

		if choice == "y" || choice == "yes" {
			renderBox("Enter ngrok auth token (optional)")
			fmt.Print("› ")
			tokenRaw, _ := reader.ReadString('\n')
			token := strings.TrimSpace(tokenRaw)
			if token != "" {
				sql.SetValue("ngrok_token", token)
			}

			renderBox("Enter ngrok endpoint (optional)")
			fmt.Print("› ")
			endpointRaw, _ := reader.ReadString('\n')
			endpoint := strings.TrimSpace(endpointRaw)
			if endpoint != "" {
				sql.SetValue("ngrok_endpoint", endpoint)
			}
		}
		step++
	}

	if step <= 2 {
	startPlayit:
		renderBox("Do you have Playit installed on your system? (y/n) \n step: 2")
		fmt.Print("› ")
		choiceRaw, _ := reader.ReadString('\n')
		choice := strings.ToLower(strings.TrimSpace(choiceRaw))

		switch choice {
		case "y", "yes":
			renderBox("Where is it installed? (full path or binary name)")
			fmt.Print("› ")
			playitPath, _ := reader.ReadString('\n')
			playitPath = strings.TrimSpace(playitPath)
			if _, err := os.Stat(playitPath); os.IsNotExist(err) {
				renderBox("The Playit executable at that path does not exist. Try again.")
				goto startPlayit
			}
			sql.SetValue("playit_path", playitPath)
			renderBox("Playit path saved!")
		case "n", "no":
			fmt.Println("Installing playit \nIt may take time, based on internet speed")
			if runtime.GOOS == "windows" {
				err := playit.InstallPlayit(utils.GetRexonPath() + "/playit.exe")
				if err != nil {
					panic(err)
				}
				sql.SetValue("playit_path", utils.GetRexonPath() + "/playit.exe")
			} else {
				err := playit.InstallPlayit("/etc/playit/playit")
				if err != nil {
					panic(err)
				}
				sql.SetValue("playit_path", "/etc/playit/playit")
			}
		default:
			renderBox("Invalid choice. Please type y, n.")
			goto startPlayit
		}
		step++
	}

	if step <= 3 {
		renderBox("Set up Playit account (visit account in Playit after step 2 completing) \n step: 3")
		fmt.Println("\nGenerating claim code")
		claimCode := "rexon-" + utils.SecureRandomString(6)
		unified := ClaimCode(sql.GetValue("playit_path"), claimCode, "self-managed", "playit-rexon 0.16.5")
		sql.SetValue("playit_secret", unified.Data.SecretKey)

		client := playit.NewClient(unified.Data.SecretKey)
		data, err := client.GetAgentRunData()
		if err != nil {
			panic(err)
		}

		var agentdata playit.AgentRunData
		json.Unmarshal(data, &agentdata)
		sql.SetValue("playit_agent_id", agentdata.Data.AgentID)
		renderBox("Playit setup complete")
		step++
	}
	if step <= 4 {
		renderBox("Install java\nenter a java version you want to install \nstep: 4")

		type AdoptiumResponse struct {
			AvailableLtsReleases     []int `json:"available_lts_releases"`
			AvailableReleases        []int `json:"available_releases"`
			MostRecentFeatureRelease int   `json:"most_recent_feature_release"`
			MostRecentFeatureVersion int   `json:"most_recent_feature_version"`
			MostRecentLts            int   `json:"most_recent_lts"`
			TipVersion               int   `json:"tip_version"`
		}

		resp, err := http.Get("https://api.adoptium.net/v3/info/available_releases")
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()

		var decoded AdoptiumResponse
		if err := json.NewDecoder(resp.Body).Decode(&decoded); err != nil {
			panic(err)
		}
		ltsMap := make(map[int]bool)
		for _, v := range decoded.AvailableLtsReleases {
			ltsMap[v] = true
		}
		fmt.Println("Available Java versions:")
		for _, v := range decoded.AvailableReleases {
			if ltsMap[v] {
				fmt.Println("-", v, "(LTS)")
			} else {
				fmt.Println("-", v)
			}
		}

		fmt.Print("› ")

		choiceRaw, _ := reader.ReadString('\n')
		choice := strings.ToLower(strings.TrimSpace(choiceRaw))
		renderBox("Installing java " + choice + "\nplease wait for some moment while we download java. Speed is based on your internet")
		done := make(chan struct{})
		go spinnerBlocks(done, "Installing Java")

		path, ok, err := java.InstallJRE(choice)

		close(done)
		if !ok {
			panic(err)
		}
		sql.SetValue("java_default", path)

		renderBox("\nJava" + choice + "installed succesfully and setuped as default")

		step++
	}

	renderBox(title.Render("✓ Setup Complete") + "\n\n" +
		muted.Render("Your panel is now secured"))
}

func readHidden() string {
	bytes, err := term.ReadPassword(os.Stdin.Fd())
	fmt.Println()
	if err != nil {
		return ""
	}
	return strings.TrimSpace(string(bytes))
}

func ClaimCode(playitPath string, claimCode, agentType, version string) playit.UnifiedResponse {
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
			//fmt.Println(string(data))
			json.Unmarshal(data, &unified)
			_, _ = client.RegisterProto("linux", version, false, false, 1, "0.0.0.0:4000", "0.0.0.0:4001")
			//cmd := exec.Command(playitPath, "--secret", unified.Data.SecretKey)
			//fmt.Println("Running agent for 1 minutes for the process to complete")
			//cmd.Start()
			//time.Sleep(5 * time.Minute)
			//err := cmd.Process.Signal(os.Interrupt)
			//if err != nil {
			//	fmt.Println("Error sending CTRL+C:", err)
			//}

			return unified

		} else if resp.Data == "UserRejected" {
			fmt.Println("You rejected the agent setup request \n Exiting, comeback here by adding -skip-to=3")
			os.Exit(1)
		}
	}
	//return playit.UnifiedResponse{}
}

func spinnerBlocks(done <-chan struct{}, msg string) {
	frames := []string{
		"[⬛⬛⬛⬛⬛]",
		"[🟩⬛⬛⬛⬛]",
		"[🟩🟩⬛⬛⬛]",
		"[🟩🟩🟩⬛⬛]",
		"[🟩🟩🟩🟩⬛]",
		"[🟩🟩🟩🟩🟩]",
		"[⬛🟩🟩🟩🟩]",
		"[⬛⬛🟩🟩🟩]",
		"[⬛⬛⬛🟩🟩]",
	}
	i := 0
	for {
		select {
		case <-done:
			fmt.Print("\r\033[K")
			return
		default:
			fmt.Printf("\r%s %s", frames[i%len(frames)], msg)
			time.Sleep(120 * time.Millisecond)
			i++
		}
	}
}
