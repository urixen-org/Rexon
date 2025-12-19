package setup

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"rexon/ancii"
	"rexon/sql"
	"strings"

	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/x/term"
)

func Setup() {
	ancii.PrintNoInput()
	sql.Init("./data.rexon")
	defer sql.Close()

	re := regexp.MustCompile(`^\d{6}$`)

	title := lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("10"))

	muted := lipgloss.NewStyle().
		Foreground(lipgloss.Color("8"))

	box := lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(lipgloss.Color("10")).
		Padding(1, 2).
		Width(50)

	renderBox := func(content string) {
		fmt.Println(box.Render(content))
	}

	reader := bufio.NewReader(os.Stdin)

	if sql.GetValue("passcode") != "" {
		renderBox(title.Render("Rexon Panel Setup") + "\n\n" +
			muted.Render("Looks like you already have a passcode.\nUpdate your 6-digit passcode to secure your panel"))
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

	renderBox("Do you want to expose your panel using ngrok? (y/n)")
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

	endpoint := sql.GetValue("ngrok_endpoint")
	endpointMsg := ""
	if endpoint != "" {
		endpointMsg = "\nYou can now access your panel at: " + endpoint
	}

	renderBox(title.Render("✓ Setup Complete") + "\n\n" +
		muted.Render("Your panel is now secured")+muted.Render(endpointMsg))
}

func readHidden() string {
	bytes, err := term.ReadPassword(os.Stdin.Fd())
	fmt.Println()
	if err != nil {
		return ""
	}
	return strings.TrimSpace(string(bytes))
}
