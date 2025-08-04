package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/text/language"
)

func LocaleMiddleware(b *i18n.Bundle) gin.HandlerFunc {
	return func(c *gin.Context) {
		lang := c.GetHeader("Accept-Language")
		matcher := language.NewMatcher(
			[]language.Tag{language.Arabic, language.English},
		)
		tag, _ := language.MatchStrings(matcher, lang)
		c.Set("locale", tag.String())
		c.Next()
	}
}

func GetLang(c *gin.Context) string {
	if v, ok := c.Get("locale"); ok {
		return v.(string)
	}
	return "ar"
}
