package mapping

import (
	_ "embed"
	"encoding/json"
	"fmt"
)

//go:embed company_map.json
var raw []byte

var CompanyToTadawul map[int]string

func init() {
	type entry struct {
		CompanyID int    `json:"companyId"`
		TadawulID string `json:"tadawulId"`
	}

	var all []entry
	if err := json.Unmarshal(raw, &all); err != nil {
		panic(fmt.Errorf("failed to unmarshal company_map.json: %w", err))
	}

	CompanyToTadawul = make(map[int]string, len(all))
	for _, e := range all {
		CompanyToTadawul[e.CompanyID] = e.TadawulID
	}
}
