package main

import (
	"os"
	"saudi-stockbot/internal/client/llm"
	"saudi-stockbot/internal/client/stock"
	"saudi-stockbot/internal/config"
	"saudi-stockbot/internal/handler"
	logger "saudi-stockbot/internal/log"
	"saudi-stockbot/internal/middleware"
	"saudi-stockbot/internal/service"
	"saudi-stockbot/internal/utils"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Server struct {
	router *gin.Engine
}

func NewServer(cfg *config.Config) *Server {
	r := gin.New()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.FrontendURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.Use(middleware.LocaleMiddleware(utils.Bundle))
	r.Use(middleware.RequestID())
	r.Use(middleware.RequestID())

	r.Use(gin.Recovery())
	r.Use(cors.Default())

	r.Use(logger.Init())

	stockClient := stock.NewStockClient(cfg)
	llmClient := llm.NewLLMClient(cfg, stockClient)
	chatService := service.NewService(cfg, llmClient, stockClient)
	h := handler.NewHandler(chatService)

	handler.RegisterRoutes(r, h)

	return &Server{router: r}
}

func (s *Server) Run() error {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	return s.router.Run(":" + port)
}
