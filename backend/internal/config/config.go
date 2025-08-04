package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	GroqAPIKey    string
	LLMModel      string
	RapidAPIV1Key string
	RapidAPIV2Key string
	RapidAPIHost  string
	FrontendURL   string
}

func Load() (*Config, error) {
	_ = godotenv.Load()

	cfg := &Config{
		GroqAPIKey:    os.Getenv("GROQ_API_KEY"),
		LLMModel:      os.Getenv("LLM_MODEL"),
		RapidAPIV1Key: os.Getenv("RAPID_API_V1_KEY"),
		RapidAPIV2Key: os.Getenv("RAPID_API_V2_KEY"),
		RapidAPIHost:  os.Getenv("RAPID_API_HOST"),
		FrontendURL:   os.Getenv("FRONTEND_URL"),
	}

	missing := []string{}
	if cfg.GroqAPIKey == "" {
		missing = append(missing, "GROQ_API_KEY")
	}
	if cfg.LLMModel == "" {
		missing = append(missing, "LLM_MODEL")
	}
	if cfg.RapidAPIV1Key == "" {
		missing = append(missing, "RAPID_API_V1_KEY")
	}
	if cfg.RapidAPIV2Key == "" {
		missing = append(missing, "RAPID_API_V2_KEY")
	}
	if cfg.RapidAPIHost == "" {
		missing = append(missing, "RAPID_API_HOST")
	}
	if cfg.FrontendURL == "" {
		missing = append(missing, "FRONTEND_URL")
	}
	if len(missing) > 0 {
		return nil, fmt.Errorf("missing required environment variables: %v", missing)
	}
	return cfg, nil
}
