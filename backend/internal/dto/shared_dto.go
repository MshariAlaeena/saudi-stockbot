package dto

type Role string

const (
	UserRole      Role = "user"
	AssistantRole Role = "assistant"
	SystemRole    Role = "system"
)

type Message struct {
	Role    Role   `json:"role"`
	Content string `json:"content"`
}

type Chart string

const (
	ChartsDetailedCompanyStockPrices Chart = "detailed_company_stock_prices"
	ChartsSearchCompanyStocks        Chart = "search_company_stocks"
)

type LLMResponse struct {
	Answer string      `json:"answer"`
	Stocks interface{} `json:"stocks"`
	Chart  Chart       `json:"chart"`
}

type Context struct {
	Chart  string      `json:"chart"`
	Stocks interface{} `json:"stocks"`
}

type ChatRequestDTO struct {
	Messages []Message `json:"messages" binding:"required"`
	Context  *Context  `json:"context"`
}
