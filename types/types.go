package types

type MsgFormat struct {
	Type    string      `json:"type"`
	Status  string      `json:"status"`
	Payload interface{} `json:"payload"`
}

type FileInfo struct {
	Name string `json:"name"`
	Type string `json:"type"`
	Size int64  `json:"size"`
	Ext  string `json:"ext"`
	Path string `json:"path"`
}
