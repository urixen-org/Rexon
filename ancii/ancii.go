package ancii

import "fmt"

func Print(web string, ftp string, ftpUser string, ftpPass string) {
	// Predeclare variables
	var colors = []string{
		"\033[31m", // red
		"\033[33m", // yellow
		"\033[32m", // green
		"\033[36m", // cyan
		"\033[34m", // blue
		"\033[35m", // magenta
		"\033[0m",  // reset
	}

	var art = ` ▄▄▄▄▄  ▄▄▄▄▄▄ ▄    ▄  ▄▄▄▄  ▄▄   ▄
 █   ▀█ █       █  █  ▄▀  ▀▄ █▀▄  █
 █▄▄▄▄▀ █▄▄▄▄▄   ██   █    █ █ █▄ █
 █   ▀▄ █       ▄▀▀▄  █    █ █  █ █
 █    ▀ █▄▄▄▄▄ ▄▀  ▀▄  █▄▄█  █   ██ 
 `

	var colorIndex int
	var r rune

	for _, r = range art {
		if r == '\n' {
			fmt.Print("\n")
			continue
		}
		fmt.Print(colors[colorIndex%len(colors)] + string(r) + "\033[0m")
		colorIndex++
	}
	fmt.Printf(`
	%sWEB%s: %s
	%sFTP%s: %s
	%sFTP username%s: %s
	%sFTP password%s: %s
	%s
	`, colors[4], colors[5], web, colors[4], colors[5], ftp, colors[4], colors[5], ftpUser, colors[4], colors[5], ftpPass, colors[6])
}
