package logger

import (
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"os"
	"time"
)

func InitLogger() {
	// Configure zerolog
	zerolog.TimeFieldFormat = time.RFC3339
	zerolog.SetGlobalLevel(zerolog.InfoLevel)

	// Create console writer with color
	output := zerolog.ConsoleWriter{
		Out:        os.Stdout,
		TimeFormat: time.RFC3339,
	}

	// Initialize logger
	log.Logger = log.Output(output)
}

func Info(message string, args ...interface{}) {
	log.Info().Fields(args).Msg(message)
}

func Error(message string, err error) {
	log.Error().Err(err).Msg(message)
}

func Debug(message string, args ...interface{}) {
	log.Debug().Fields(args).Msg(message)
}

func Warn(message string, args ...interface{}) {
	log.Warn().Fields(args).Msg(message)
}

func Fatal(message string, err error) {
	log.Fatal().Err(err).Msg(message)
}
