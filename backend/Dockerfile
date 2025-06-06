# Используем официальный образ Go для сборки
FROM golang:1.21-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем зависимости для сборки
RUN apk add --no-cache gcc musl-dev

# Копируем go.mod и go.sum для кэширования зависимостей
COPY go.mod go.sum ./
RUN go mod download

# Копируем исходный код
COPY . .

# Собираем приложение
RUN go build -o main .

# Создаем директорию для загрузки файлов
RUN mkdir -p uploads

# Открываем порт
EXPOSE 8080

# Запускаем приложение
CMD ["./main"]