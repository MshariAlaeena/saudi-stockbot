package handler

import (
	"saudi-stockbot/internal/dto"
	"saudi-stockbot/internal/mapping"
	"saudi-stockbot/internal/service"
	"saudi-stockbot/internal/utils"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

type Handler struct {
	service *service.Service
}

func NewHandler(service *service.Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) HandleGetHealth(c *gin.Context) {
	c.JSON(200, NewResponse("OK", utils.Localize(c, "system_is_up_and_running")))
}

func (h *Handler) HandleChat(c *gin.Context) {
	var request dto.ChatRequestDTO
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(400, NewResponse(nil, utils.Localize(c, "request_is_invalid")))
		return
	}

	data, err := h.service.Chat(c.Request.Context(), request)
	if err != nil {
		log.Error().Msg("error: " + err.Error())
		c.JSON(500, NewResponse(nil, utils.Localize(c, "an_error_occurred_while_processing_your_request")))
		return
	}

	c.JSON(200, NewResponse(data, utils.Localize(c, "chat_message_sent")))
}

func (h *Handler) HandleGetDashboard(c *gin.Context) {
	data, err := h.service.GetDashboard()
	if err != nil {
		log.Error().Msg("HandleGetDashboard :: " + err.Error())
		c.JSON(500, NewResponse(nil, utils.Localize(c, "an_error_occurred_while_processing_your_request")))
		return
	}

	c.JSON(200, NewResponse(data, utils.Localize(c, "chat_message_sent")))
}

func (h *Handler) HandleGetCompanyChart(c *gin.Context) {
	if tid := c.Query("tadawulId"); tid != "" {
		data, err := h.service.GetCompanyChart(tid)
		if err != nil {
			log.Error().Msg("HandleGetCompanyChart :: " + err.Error())
			c.JSON(500, NewResponse(nil, utils.Localize(c, "an_error_occurred")))
			return
		}
		c.JSON(200, NewResponse(data, utils.Localize(c, "chat_message_sent")))
		return
	}

	cid, err := strconv.Atoi(c.Query("companyId"))
	if err != nil {
		c.JSON(400, NewResponse(nil, utils.Localize(c, "invalid_company_id")))
		return
	}
	tadawulID := mapping.CompanyToTadawul[cid]
	if tadawulID == "" {
		c.JSON(400, NewResponse(nil, utils.Localize(c, "invalid_company_id")))
		return
	}

	data, err := h.service.GetCompanyChart(tadawulID)
	if err != nil {
		log.Error().Msg("HandleGetCompanyChart :: " + err.Error())
		c.JSON(500, NewResponse(nil, utils.Localize(c, "an_error_occurred")))
		return
	}
	c.JSON(200, NewResponse(data, utils.Localize(c, "chat_message_sent")))
}
