package setup

import (
	"fmt"
	"os"
	"regexp"
	"rexon/sql"
	"strings"

	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/x/term"
)

func Setup() string {
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
		Width(42)

	if sql.GetValue("passcode") != "" {
		fmt.Println(box.Render(
			title.Render("Rexon Panel Setup") + "\n\n" + muted.Render("Look like you have already set passcode\n") +
				muted.Render("Create a 6-digit passcode to secure your panel"),
		))
	} else {
		fmt.Println(box.Render(
			title.Render("Rexon Panel Setup") + "\n\n" +
				muted.Render("Create a 6-digit passcode to secure your panel"),
		))
	}

	for {
		fmt.Print("Create passcode (6 digits)\n› ")
		first := readHidden()

		if !re.MatchString(first) {
			fmt.Println("Passcode must be exactly 6 digits")
			continue
		}

		fmt.Print("Confirm passcode\n› ")
		second := readHidden()

		if first != second {
			fmt.Println("Passcodes do not match. Try again.")
			continue
		}

		fmt.Println()
		fmt.Println(box.Render(
			title.Render("✓ Setup Complete") + "\n\n" +
				muted.Render("Your panel is now secured"),
		))

		return first
	}
}

func readHidden() string {
	bytes, err := term.ReadPassword(os.Stdin.Fd())
	fmt.Println()

	if err != nil {
		return ""
	}

	return strings.TrimSpace(string(bytes))
}
