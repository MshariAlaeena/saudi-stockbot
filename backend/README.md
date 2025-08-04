# Saudi StockBot Backend

A Go-based API service powering **Saudi StockBot**, an AI-driven Tadawul (TASI) dashboard and chatbot. It handles real-time market data, chart context, chat requests, and company mapping.

## Features

* **Chat API**: Context-aware AI conversations with chart data attachment
* **Chart Data**: Detailed OHLC and volume endpoints for company stocks
* **Top Movers**: Gain and loss listings via dedicated endpoints
* **Company Mapping**: `companyId ↔ tadawulId` loader from embedded JSON
* **Mock & Real Feeds**: Pluggable data sources (real feed + mock fallback)
* **Health Checks**: Simple status endpoint

## Tech Stack

* **Language:** Go 1.20+
* **Framework:** Gin HTTP router
* **LLM API:** Groq chat completion (with function/tool calls)
* **Data Storage:** In-memory & JSON-embedded mapping

## Architecture

```
Client ⇄ Gin API ⇄ Services:
  • Stock Data Client   (RapidAPI / Mock)
  • Chat Service        (Groq)
  • Mapping Loader      (embed JSON)
```

## Getting Started

### Prerequisites

* Go 1.20 or higher
* Groq API key
* RapidAPI credentials for Saudi market data

### Installation

```bash
git clone https://github.com/your-org/saudi-stockbot-backend.git
cd saudi-stockbot-backend
go mod download
go build -o stockbot-backend ./cmd/server
```

### Configuration

Copy `.env.example` to `.env` and update:

```dotenv
GROQ_API_KEY=your_groq_api_key
LLM_MODEL=your_groq_llm_model
RAPID_API_V1_KEY=your_rapid_v1_api_key
RAPID_API_V2_KEY=your_rapid_v2_api_key
RAPID_API_HOST=your_rapid_host
FRONTEND_URL=your_frontend_url
MOCK_DATA=true  # Enable mock data for certain APIs due to data availability constraints
```

## Running

**1. Build & run:**

```bash
make run
```

**2. Development mode:**

```bash
make run-dev
```

Defaults to listening on **:8080**.

## API Endpoints

### Health Check

```
GET /health
Response 200
{ "status": "ok" }
```

### Chat

```
POST /api/v1/chat
Content-Type: application/json
Body:
{
  "messages": [ { "role": "user", "content": "..." }, … ],
  "context": {          // optional
    "chart": "search_company_stocks" | "detailed_company_stock_prices",
    "stocks": { … } | [ … ]
  }
}
Response 200
{
  "choices": [ { "message": { "role": "assistant", "content": "...", "tool_calls": […] } } ]
}
```

## License

MIT License.
