package utils

import (
	"encoding/json"
	"path/filepath"
	"saudi-stockbot/internal/middleware"

	"github.com/gin-gonic/gin"
	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/text/language"
)

var Bundle *i18n.Bundle

func Init() {
	Bundle = i18n.NewBundle(language.English)
	Bundle.RegisterUnmarshalFunc("json", json.Unmarshal)

	localeDir := "internal/locales"
	Bundle.MustLoadMessageFile(filepath.Join(localeDir, "en.json"))
	Bundle.MustLoadMessageFile(filepath.Join(localeDir, "ar.json"))
}

func Localize(c *gin.Context, key string) string {
	lang := middleware.GetLang(c)
	localizer := i18n.NewLocalizer(Bundle, lang)
	msg, _ := localizer.Localize(&i18n.LocalizeConfig{MessageID: key})
	return msg
}
