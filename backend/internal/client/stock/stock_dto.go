package stock

import (
	"encoding/json"
)

type Function string

const (
	FunctionGetDailyInformationForAllCompanies Function = "GetDailyInformationForAllCompanies"
	FunctionGetDetailedCompanyStockPrices      Function = "GetDetailedCompanyStockPrices"
	FunctionGetTodayTopFiveGainersOrLosers     Function = "GetTodayTopFiveGainersOrLosers"
	FunctionSearchCompanyStocks                Function = "SearchCompanyStocks"
	FunctionGetThisWeekDividends               Function = "GetThisWeekDividends"
)

type QueryPayload struct {
	Query string `json:"query"`
}

type SearchCompanyStocksArguments struct {
	CompanyName string `json:"companyName"`
}

type SearchCompanyStocksResponse struct {
	TadawulID     string  `json:"tadawulID"`
	CompanyID     int     `json:"companyID"`
	CompanyName   string  `json:"companyName"`
	Sector        string  `json:"sector"`
	AcrynomNameAr string  `json:"acrynomNameAr"`
	ArgaamID      string  `json:"argaamID"`
	CompanyNameAr string  `json:"companyNameAr"`
	SectorAr      string  `json:"sectorAr"`
	AcrynomName   string  `json:"acrynomName"`
	Price         float64 `json:"price"`
	Change        float64 `json:"change"`
	ChangePercent float64 `json:"changePercent"`
}

type GetDetailedCompanyStockPricesResponseArguments struct {
	TadawulID string `json:"tadawulID"`
}

type GetDetailedCompanyStockPricesResponse struct {
	Date   string  `json:"date"`
	Open   float64 `json:"open"`
	Close  float64 `json:"close"`
	High   float64 `json:"high"`
	Low    float64 `json:"low"`
	Volume int     `json:"volume"`
	X      float64 `json:"x"`
	Y      float64 `json:"y"`
}

type TopFiveGainersOrLosersResponse struct {
	CompanyID        int     `json:"companyID"`
	ArgaamID         string  `json:"argaamID"`
	CompanyName      string  `json:"companyName"`
	CompanyNameAr    string  `json:"companyNameAr"`
	AcrynomNameAr    string  `json:"acrynomNameAr"`
	Sector           string  `json:"sector"`
	SectorAr         string  `json:"sectorAr"`
	PercentageGained float64 `json:"percentageGained"`
	Price            float64 `json:"price"`
}

type RapidAPIResponse struct {
	Success bool            `json:"success"`
	Data    json.RawMessage `json:"data"`
}
