package mc

type Player struct {
	UUID        string
	Health      float64
	Absorption  float64
	XPLevel     int
	XPTotal     int
	XPProgress  float64
	FoodLevel   int
	Saturation  float64
	Exhaustion  float64
	FallDistance float64
	OnGround    bool
	Gamemode    int
	Pos         [3]float64
	Motion      [3]float64
	Rotation    [2]float64
	Dimension   string
	Inventory   []Item
	EnderChest  []Item
	Selected    Item
	SelectedSlot int
	Abilities   map[string]any
	Attributes  []Attribute
	LastSeen    int64
	Flags       map[string]any
}

type Item struct {
	ID     string
	Count  int
	Slot   int
	Damage int
}

type Attribute struct {
	Name  string
	Value float64
}
