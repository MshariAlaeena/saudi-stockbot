package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"saudi-stockbot/internal/client/stock"
	"saudi-stockbot/internal/config"
	"saudi-stockbot/internal/dto"
	"sort"
	"strings"
	"time"
)

const (
	CHAT_SYSTEM_PROMPT_EN = `
	You Are Saudi stock market expert.
	Answer like a Saudi stock market expert.
	Do NOT use any Markdown or styling characters (no asterisks, underscores, backticks, etc.).
	Keep punctuation, spacing, and line breaks, but everything must be plain text.
	`
)

type LLMClient struct {
	cfg         *config.Config
	stockClient *stock.StockClient
}

func NewLLMClient(cfg *config.Config, stockClient *stock.StockClient) *LLMClient {
	return &LLMClient{cfg: cfg, stockClient: stockClient}
}

func (l *LLMClient) Chat(ctx context.Context, messages []dto.Message, answerContext *dto.Context) (string, []ToolCallsBlock, error) {
	var sysBuf bytes.Buffer
	sysBuf.WriteString(CHAT_SYSTEM_PROMPT_EN)

	if answerContext != nil && answerContext.Chart != "" {
		sysBuf.WriteString("Context:\n")
		sysBuf.WriteString("- " + fmt.Sprintf("%+v", answerContext.Stocks) + "\n")
	}

	msgs := []ChatMessageBlock{
		{Role: "system", Content: sysBuf.String()},
	}

	for _, message := range messages {
		if strings.TrimSpace(message.Content) != "" {
			msgs = append(msgs, ChatMessageBlock{
				Role:    message.Role,
				Content: message.Content,
			})
			continue
		}
		if len(msgs) > 0 {
			msgs = msgs[:len(msgs)-1]
		}
	}

	reqBody := ChatRequest{
		Messages:            msgs,
		Temperature:         0,
		MaxCompletionTokens: 1024,
		TopP:                1.0,
		Stream:              false,
		Stop:                []string{"ERROR"},
		Model:               l.cfg.LLMModel,
		Tools: []ToolCallRequest{
			{
				Type: "function",
				Function: ToolCallFunctionRequest{
					Name:        string(stock.FunctionSearchCompanyStocks),
					Description: "Search for a company's stocks by giving the company name",
					Parameters: ParametersRequest{
						Type: "object",
						Properties: map[string]interface{}{
							"companyName": map[string]interface{}{
								"type":        "string",
								"description": "The name of the company to search for",
							},
						},
						Required: []string{"companyName"},
					},
				},
			},
			{
				Type: "function",
				Function: ToolCallFunctionRequest{
					Name:        string(stock.FunctionGetDetailedCompanyStockPrices),
					Description: "Get detailed company stock prices since last month by giving the company tadawul id",
					Parameters: ParametersRequest{
						Type: "object",
						Properties: map[string]interface{}{
							"tadawulID": map[string]interface{}{
								"type":        "string",
								"description": "The tadawul id of the company to search for",
							},
						},
						Required: []string{"tadawulID"},
					},
				},
			},
		},
		ToolChoice: "auto",
	}

	payload, err := json.Marshal(reqBody)
	if err != nil {
		return "", nil, fmt.Errorf("llm client :: Chat :: error marshalling chat request: %w", err)
	}

	answer, toolCalls, err := CallGroqAPI(ctx, l.cfg, payload)
	if err != nil {
		return "", nil, fmt.Errorf("llm client :: Chat :: error calling groq API: %w", err)
	}
	return answer, toolCalls, nil
}

func CallGroqAPI(ctx context.Context, cfg *config.Config, payload []byte) (string, []ToolCallsBlock, error) {
	req, err := http.NewRequestWithContext(ctx, "POST", "https://api.groq.com/openai/v1/chat/completions", bytes.NewReader(payload))
	if err != nil {
		return "", nil, fmt.Errorf("llm client :: CallGroqAPI :: error creating request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+cfg.GroqAPIKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", nil, fmt.Errorf("llm client :: CallGroqAPI :: error calling groq API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", nil, fmt.Errorf("llm client :: CallGroqAPI :: error calling groq API: %s", string(body))
	}

	var cr ChatResponse
	if err := json.NewDecoder(resp.Body).Decode(&cr); err != nil {
		return "", nil, fmt.Errorf("llm client :: CallGroqAPI :: error decoding chat response: %w", err)
	}
	if len(cr.Choices) == 0 {
		return "", nil, fmt.Errorf("llm client :: CallGroqAPI :: no choices in chat response")
	}
	return cr.Choices[0].Message.Content, cr.Choices[0].Message.ToolCalls, nil
}

func DailySummary(ticks []stock.GetDetailedCompanyStockPricesResponse) []stock.GetDetailedCompanyStockPricesResponse {
	agg := make(map[string]stock.GetDetailedCompanyStockPricesResponse)
	for _, tk := range ticks {
		t, err := time.Parse("2006-01-02 15:04:05", tk.Date)
		if err != nil {
			continue
		}
		dayKey := t.Format("2006-01-02")
		if prev, ok := agg[dayKey]; ok {
			if tk.High > prev.High {
				prev.High = tk.High
			}
			if tk.Low < prev.Low {
				prev.Low = tk.Low
			}
			prev.Close = tk.Close
			prev.Volume += tk.Volume
			agg[dayKey] = prev
		} else {
			agg[dayKey] = stock.GetDetailedCompanyStockPricesResponse{
				Date:   dayKey + "T00:00:00",
				Open:   tk.Open,
				High:   tk.High,
				Low:    tk.Low,
				Close:  tk.Close,
				Volume: tk.Volume,
				X:      tk.X,
				Y:      tk.Y,
			}
		}
	}

	var dates []time.Time
	for d := range agg {
		t, _ := time.Parse("2006-01-02", d)
		dates = append(dates, t)
	}
	sort.Slice(dates, func(i, j int) bool { return dates[i].Before(dates[j]) })

	start, end := dates[0], dates[len(dates)-1]
	result := []stock.GetDetailedCompanyStockPricesResponse{}
	var lastThu stock.GetDetailedCompanyStockPricesResponse

	for curr := start; !curr.After(end); curr = curr.AddDate(0, 0, 1) {
		key := curr.Format("2006-01-02")
		if entry, ok := agg[key]; ok {
			result = append(result, entry)
			if curr.Weekday() == time.Thursday {
				lastThu = entry
			}
		} else if curr.Weekday() == time.Friday || curr.Weekday() == time.Saturday {
			filled := lastThu
			filled.Date = key + "T00:00:00"
			result = append(result, filled)
		}
	}

	return result
}
