FROM python:3.11-slim

# Копируем сертификаты в корень контейнера
COPY server.crt /server.crt
COPY server.key /server.key

# Копируем собранную статику фронтенда
COPY dist/ /app/dist/

# Копируем наш кастомный HTTPS сервер
COPY server.py /app/server.py

WORKDIR /app

# Запускаем скрипт, передавая ему папку со статикой
CMD ["python3", "server.py", "dist"]