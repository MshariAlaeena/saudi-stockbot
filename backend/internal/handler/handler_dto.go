package handler

type HandlerResponse struct {
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}

func NewResponse(data interface{}, message string) HandlerResponse {
	return HandlerResponse{
		Data:    data,
		Message: message,
	}
}
