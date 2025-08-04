package log

import (
	"os"

	"github.com/gin-contrib/logger"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func Init() gin.HandlerFunc {
	// @NOTE: Global Logger
	log.Logger = zerolog.New(os.Stderr).
		Level(zerolog.InfoLevel).
		With().
		Timestamp().
		Logger()

	// @NOTE: Request Logger
	return logger.SetLogger(
		logger.WithLogger(
			func(c *gin.Context, _ zerolog.Logger) zerolog.Logger {
				return zerolog.New(os.Stderr).
					Level(zerolog.InfoLevel).
					With().
					Timestamp().
					Str("request_id", c.GetString("RequestID")).
					Logger()
			},
		),
		logger.WithSkipPath([]string{"/api/v1/health"}),
	)
}
