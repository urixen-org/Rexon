package ancii

import (
	"fmt"

	"github.com/charmbracelet/lipgloss"
)

var art = ` ▄▄▄▄▄  ▄▄▄▄▄▄ ▄    ▄  ▄▄▄▄  ▄▄   ▄
█   ▀█ █       █  █  ▄▀  ▀▄ █▀▄  █
█▄▄▄▄▀ █▄▄▄▄▄   ██   █    █ █ █▄ █
█   ▀▄ █       ▄▀▀▄  █    █ █  █ █
█    ▀ █▄▄▄▄▄ ▄▀  ▀▄  █▄▄█  █   ██
`

var colors = []string{
	"\033[31m", // red
	"\033[33m", // yellow
	"\033[32m", // green
	"\033[36m", // cyan
	"\033[34m", // blue
	"\033[35m", // magenta
}

func rainbowText(input string) string {
	result := ""
	colorIndex := 0
	for _, r := range input {
		if r == '\n' {
			result += "\n"
			continue
		}
		result += colors[colorIndex%len(colors)] + string(r) + "\033[0m"
		colorIndex++
	}
	return result
}

func Print(web, ftp, ftpUser, ftpPass string) {
	labelColor := lipgloss.NewStyle().Foreground(lipgloss.Color("12")) // bright cyan
	valueColor := lipgloss.NewStyle().Foreground(lipgloss.Color("13")) // bright magenta

	box := lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(lipgloss.Color("10")).
		Padding(1, 2).
		Width(60)

	content := fmt.Sprintf("%s\n\n%s: %s\n%s: %s\n%s: %s\n%s: %s",
		rainbowText(art),
		labelColor.Render("WEB"), valueColor.Render(web),
		labelColor.Render("FTP"), valueColor.Render(ftp),
		labelColor.Render("FTP username"), valueColor.Render(ftpUser),
		labelColor.Render("FTP password"), valueColor.Render(ftpPass),
	)

	fmt.Println(box.Render(content))
}

func PrintNoInput() {
	box := lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(lipgloss.Color("10")).
		Padding(1, 2).
		Width(60)

	fmt.Println(box.Render(rainbowText(art)))
}
