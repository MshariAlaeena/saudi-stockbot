package handler

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, h *Handler) {
	api := r.Group("/api/v1")
	{
		api.GET("/health", h.HandleGetHealth)
		api.POST("/chat", h.HandleChat)
		api.GET("/dashboard", h.HandleGetDashboard)
		api.GET("/dashboard/chart", h.HandleGetCompanyChart)
	}
}
