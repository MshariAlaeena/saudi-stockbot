package stock

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"saudi-stockbot/internal/config"

	"github.com/rs/zerolog/log"
)

type TopGainersOrLosers string

const (
	TopGainers TopGainersOrLosers = "top-gainers"
	TopLosers  TopGainersOrLosers = "top-losers"

	rapidAPIURL = "https://saudi-exchange-stocks-tadawul.p.rapidapi.com/v1"
)

type StockClient struct {
	cfg *config.Config
}

func NewStockClient(cfg *config.Config) *StockClient {
	return &StockClient{cfg: cfg}
}

func (c *StockClient) GetDetailedCompanyStockPrices(
	companyID string,
) ([]GetDetailedCompanyStockPricesResponse, error) {
	url := fmt.Sprintf("%s/stock/getPrice?companyId=%s&period=1M", rapidAPIURL, companyID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("stock client :: GetDetailedCompanyStockPrices :: error creating request: %w", err)
	}

	req.Header.Add("x-rapidapi-key", c.cfg.RapidAPIV1Key)
	res, err := c.callRapidAPI(req)
	if err != nil {
		return nil, fmt.Errorf("stock client :: GetDetailedCompanyStockPrices :: error calling rapidAPI: %w", err)
	}

	var details []GetDetailedCompanyStockPricesResponse
	err = json.Unmarshal(res.Data, &details)
	if err != nil {
		return nil, fmt.Errorf("stock client :: GetDetailedCompanyStockPrices :: error unmarshalling response: %w", err)
	}
	return details, nil
}

func (c *StockClient) GetTodayTopFiveGainersOrLosers(topGainersOrLosers TopGainersOrLosers) ([]TopFiveGainersOrLosersResponse, error) {
	url := fmt.Sprintf("%s/stock/%s", rapidAPIURL, topGainersOrLosers)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("stock client :: GetTodayTopFiveGainersOrLosers :: error creating request: %w", err)
	}

	req.Header.Add("x-rapidapi-key", c.cfg.RapidAPIV2Key)
	res, err := c.callRapidAPI(req)
	if err != nil {
		return nil, fmt.Errorf("stock client :: GetTodayTopFiveGainersOrLosers :: error calling rapidAPI: %w", err)
	}

	var details []TopFiveGainersOrLosersResponse
	err = json.Unmarshal(res.Data, &details)
	if err != nil {
		return nil, fmt.Errorf("stock client :: GetTodayTopFiveGainersOrLosers :: error unmarshalling response: %w", err)
	}
	return details, nil
}

func (c *StockClient) SearchCompanyStocks(companyName string) (*SearchCompanyStocksResponse, error) {
	url := fmt.Sprintf("%s/stock/search-stocks-with-prices/", rapidAPIURL)

	qp := QueryPayload{Query: companyName}
	body, err := json.Marshal(qp)
	if err != nil {
		return nil, fmt.Errorf("stock client :: SearchCompanyStocks :: error marshalling query payload: %w", err)
	}
	payload := bytes.NewReader(body)

	req, err := http.NewRequest("POST", url, payload)
	if err != nil {
		return nil, fmt.Errorf("stock client :: SearchCompanyStocks:: error creating request: %w", err)
	}
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("x-rapidapi-key", c.cfg.RapidAPIV2Key)
	res, err := c.callRapidAPI(req)
	if err != nil {
		return nil, fmt.Errorf("stock client :: SearchCompanyStocks :: error calling rapidAPI: %w", err)
	}

	if !res.Success {
		return nil, nil
	}

	var details []SearchCompanyStocksResponse
	err = json.Unmarshal(res.Data, &details)
	if err != nil {
		return nil, fmt.Errorf("stock client :: SearchCompanyStocks :: 	error unmarshalling response: %w", err)
	}
	return &details[0], nil
}

func (c *StockClient) callRapidAPI(req *http.Request) (*RapidAPIResponse, error) {
	req.Header.Add("x-rapidapi-host", c.cfg.RapidAPIHost)

	log.Info().Msgf("stock client :: callRapidAPI :: url: %s", req.URL.String())
	log.Info().Msgf("stock client :: callRapidAPI :: headers: %s", req.Header)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("stock client :: callRapidAPI :: error reading body: %w", err)
	}

	log.Info().Msgf("RapidAPI full body: %s", string(body))

	var rapidAPIResponse RapidAPIResponse
	err = json.Unmarshal(body, &rapidAPIResponse)
	if err != nil {
		return nil, fmt.Errorf("stock client :: callRapidAPI :: error unmarshalling response: %w", err)
	}

	return &rapidAPIResponse, nil
}
