package service

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"math/rand/v2"
	"os"
	"saudi-stockbot/internal/client/llm"
	"saudi-stockbot/internal/client/stock"
	"saudi-stockbot/internal/config"
	"saudi-stockbot/internal/dto"
	"strings"
	"time"
)

var MOCK_DATA = os.Getenv("MOCK_DATA") == "true"

type Service struct {
	cfg         *config.Config
	llmClient   *llm.LLMClient
	stockClient *stock.StockClient
}

func NewService(
	cfg *config.Config,
	llmClient *llm.LLMClient,
	stockClient *stock.StockClient,
) *Service {
	return &Service{
		cfg:         cfg,
		llmClient:   llmClient,
		stockClient: stockClient,
	}
}

func (s *Service) Chat(ctx context.Context, request dto.ChatRequestDTO) (*dto.LLMResponse, error) {
	messages := request.Messages
	answerContext := request.Context

	if len(messages) > 50 {
		messages = messages[len(messages)-50:]
	}

	answer, toolCalls, err := s.llmClient.Chat(ctx, messages, answerContext)
	if err != nil {
		return nil, err
	}

	if len(toolCalls) > 0 {
		toolCall := toolCalls[0]
		switch toolCall.Function.Name {
		case stock.FunctionSearchCompanyStocks:
			var rawArg json.RawMessage = toolCall.Function.Arguments
			var jsonText string
			if err := json.Unmarshal(rawArg, &jsonText); err != nil {
				return nil, fmt.Errorf("decoding arguments wrapper: %w", err)
			}
			var searchCompanyStocksResponse stock.SearchCompanyStocksArguments
			err := json.Unmarshal([]byte(jsonText), &searchCompanyStocksResponse)
			if err != nil {
				return nil, err
			}
			if MOCK_DATA {
				return &dto.LLMResponse{
					Answer: answer,
					Stocks: s.GetMockSearchCompanyStocks(searchCompanyStocksResponse.CompanyName),
					Chart:  dto.ChartsSearchCompanyStocks,
				}, nil
			}
			getDetailedCompanyStockPricesResponse, err := s.stockClient.SearchCompanyStocks(searchCompanyStocksResponse.CompanyName)
			if err != nil {
				return nil, err
			}
			if getDetailedCompanyStockPricesResponse == nil {
				return &dto.LLMResponse{
					Answer: "Sorry, I couldn't find any stocks for " + searchCompanyStocksResponse.CompanyName,
					Stocks: nil,
					Chart:  dto.ChartsSearchCompanyStocks,
				}, nil
			}
			return &dto.LLMResponse{
				Answer: answer,
				Stocks: getDetailedCompanyStockPricesResponse,
				Chart:  dto.ChartsSearchCompanyStocks,
			}, nil
		case stock.FunctionGetDetailedCompanyStockPrices:
			if MOCK_DATA {
				return &dto.LLMResponse{
					Answer: answer,
					Stocks: s.GetMockCompanyChart(),
					Chart:  dto.ChartsDetailedCompanyStockPrices,
				}, nil
			}
			var rawArg json.RawMessage = toolCall.Function.Arguments
			var jsonText string
			if err := json.Unmarshal(rawArg, &jsonText); err != nil {
				return nil, fmt.Errorf("service :: Chat :: error decoding arguments wrapper: %w", err)
			}
			var getDetailedCompanyStockPricesResponseArguments stock.GetDetailedCompanyStockPricesResponseArguments
			err := json.Unmarshal([]byte(jsonText), &getDetailedCompanyStockPricesResponseArguments)
			if err != nil {
				return nil, fmt.Errorf("service :: Chat :: error unmarshalling arguments: %w", err)
			}
			getDetailedCompanyStockPricesResponse, err := s.stockClient.GetDetailedCompanyStockPrices(getDetailedCompanyStockPricesResponseArguments.TadawulID)
			if err != nil {
				return nil, fmt.Errorf("service :: Chat :: error getting detailed company stock prices: %w", err)
			}

			return &dto.LLMResponse{
				Answer: answer,
				Stocks: getDetailedCompanyStockPricesResponse,
				Chart:  dto.ChartsDetailedCompanyStockPrices,
			}, nil
		}
	}

	return &dto.LLMResponse{
		Answer: answer,
		Stocks: nil,
		Chart:  "",
	}, nil

}

func (s *Service) GetDashboard() ([]stock.TopFiveGainersOrLosersResponse, error) {
	topFiveGainers, err := s.stockClient.GetTodayTopFiveGainersOrLosers(stock.TopGainers)
	if err != nil {
		return nil, err
	}
	topFiveLosers, err := s.stockClient.GetTodayTopFiveGainersOrLosers(stock.TopLosers)
	if err != nil {
		return nil, err
	}

	topFiveGainersAndLosers := make([]stock.TopFiveGainersOrLosersResponse, len(topFiveGainers)+len(topFiveLosers))
	copy(topFiveGainersAndLosers, topFiveGainers)
	copy(topFiveGainersAndLosers[len(topFiveGainers):], topFiveLosers)

	return topFiveGainersAndLosers, nil
}

func (s *Service) GetCompanyChart(ID string) ([]stock.GetDetailedCompanyStockPricesResponse, error) {
	if MOCK_DATA {
		return s.GetMockCompanyChart(), nil
	}
	return s.stockClient.GetDetailedCompanyStockPrices(ID)
}

func (s *Service) GetMockSearchCompanyStocks(companyName string) *stock.SearchCompanyStocksResponse {
	return &stock.SearchCompanyStocksResponse{
		TadawulID:     fmt.Sprintf("%04d", 100+rand.IntN(9900)),
		CompanyID:     1,
		CompanyName:   strings.ToUpper(companyName),
		Sector:        "Technology",
		AcrynomNameAr: companyName,
		ArgaamID:      fmt.Sprintf("%04d", 100+rand.IntN(10100)),
		CompanyNameAr: "",
		SectorAr:      "التكنولوجيا",
		AcrynomName:   companyName,
		Price:         math.Round(rand.Float64()*1000) / 100,
		Change:        math.Round(rand.Float64()*100) / 100,
		ChangePercent: math.Round(rand.Float64()*100) / 100,
	}
}
func (s *Service) GetMockCompanyChart() []stock.GetDetailedCompanyStockPricesResponse {

	base := 100.0

	mockData := make([]stock.GetDetailedCompanyStockPricesResponse, 31)

	for i := 0; i < 31; i++ {
		prevClose := base
		if i > 0 {
			prevClose = mockData[i-1].Close
		}

		delta := rand.NormFloat64() * 2.0
		open := prevClose + rand.NormFloat64()*0.5
		close := prevClose + delta
		high := math.Max(open, close) + rand.Float64()*1.0
		low := math.Min(open, close) - rand.Float64()*1.0

		mockData[i] = stock.GetDetailedCompanyStockPricesResponse{
			Date:   time.Now().AddDate(0, 0, -i).Format("2006-01-02"),
			Open:   open,
			Close:  close,
			High:   high,
			Low:    low,
			Volume: int(1000 + rand.Float64()*5000),
		}
	}
	return mockData
}
