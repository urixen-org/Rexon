package mc

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"strings"
)

type lineType uint8

const (
	lineEmpty lineType = iota
	lineComment
	lineProperty
)

type propertyLine struct {
	kind  lineType
	key   string
	value string
	raw   string
}

type Properties struct {
	lines []propertyLine
	index map[string]int
}

func LoadProperties(path string) (*Properties, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	return ParseProperties(f)
}

func ParseProperties(r io.Reader) (*Properties, error) {
	scanner := bufio.NewScanner(r)

	p := &Properties{
		lines: make([]propertyLine, 0),
		index: make(map[string]int),
	}

	for scanner.Scan() {
		raw := scanner.Text()
		trim := strings.TrimSpace(raw)

		switch {
		case trim == "":
			p.lines = append(p.lines, propertyLine{
				kind: lineEmpty,
				raw:  raw,
			})

		case strings.HasPrefix(trim, "#"):
			p.lines = append(p.lines, propertyLine{
				kind: lineComment,
				raw:  raw,
			})

		default:
			key, val, ok := strings.Cut(raw, "=")
			if !ok {
				p.lines = append(p.lines, propertyLine{
					kind: lineComment,
					raw:  raw,
				})
				continue
			}

			key = strings.TrimSpace(key)
			val = strings.TrimSpace(val)

			p.index[key] = len(p.lines)
			p.lines = append(p.lines, propertyLine{
				kind:  lineProperty,
				key:   key,
				value: val,
			})
		}
	}

	return p, scanner.Err()
}

func (p *Properties) Get(key string) (string, bool) {
	i, ok := p.index[key]
	if !ok {
		return "", false
	}
	return p.lines[i].value, true
}

func (p *Properties) Set(key, value string) {
	if i, ok := p.index[key]; ok {
		p.lines[i].value = value
		return
	}

	p.index[key] = len(p.lines)
	p.lines = append(p.lines, propertyLine{
		kind:  lineProperty,
		key:   key,
		value: value,
	})
}

func (p *Properties) GetBool(key string, def bool) bool {
	v, ok := p.Get(key)
	if !ok {
		return def
	}
	return v == "true"
}

func (p *Properties) GetInt(key string, def int) int {
	v, ok := p.Get(key)
	if !ok {
		return def
	}
	var i int
	if _, err := fmt.Sscanf(v, "%d", &i); err != nil {
		return def
	}
	return i
}

func (p *Properties) Save(path string) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()

	w := bufio.NewWriter(f)
	for _, l := range p.lines {
		switch l.kind {
		case lineEmpty, lineComment:
			fmt.Fprintln(w, l.raw)
		case lineProperty:
			fmt.Fprintf(w, "%s=%s\n", l.key, l.value)
		}
	}
	return w.Flush()
}

func (p *Properties) All() map[string]string {
	out := make(map[string]string, len(p.index))
	for _, l := range p.lines {
		if l.kind == lineProperty {
			out[l.key] = l.value
		}
	}
	return out
}
