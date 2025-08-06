build-game-engine:
	docker build -t game-engine ./Game-engine/backend
	docker compose up --build