.PHONY: help init up down infra-up infra-down app-up app-down restart ps logs logs-infra clean

# Default target
help:
	@echo "TechSolve 2025 - Docker Command Center"
	@echo "======================================"
	@echo "Available commands:"
	@echo "  make init         - Create docker network and start all containers"
	@echo "  make up           - Start both infra and app services"
	@echo "  make down         - Stop both app and infra services"
	@echo "  make infra-up     - Start infrastructure services (Loki, Jaeger, Prometheus, etc.)"
	@echo "  make infra-down   - Stop infrastructure services"
	@echo "  make app-up       - Start application services (DB, Redis, Backend, Frontend)"
	@echo "  make app-down     - Stop application services"
	@echo "  make restart      - Restart all services"
	@echo "  make ps           - List all running containers"
	@echo "  make logs         - View logs for application services"
	@echo "  make logs-infra   - View logs for infrastructure services"
	@echo "  make clean        - Stop everything and remove volumes"

# Create network if not exists
init:
	docker network inspect greenflag-net >/dev/null 2>&1 || docker network create greenflag-net
	docker compose -f docker-compose.infra.yml up -d
	docker compose up -d

# Start all (assumes network exists or creates it)
up:
	docker network inspect greenflag-net >/dev/null 2>&1 || docker network create greenflag-net
	docker compose -f docker-compose.infra.yml up -d
	docker compose up -d

# Stop all
down:
	docker compose down
	docker compose -f docker-compose.infra.yml down

# Infra-specific
infra-up:
	docker network inspect greenflag-net >/dev/null 2>&1 || docker network create greenflag-net
	docker compose -f docker-compose.infra.yml up -d

infra-down:
	docker compose -f docker-compose.infra.yml down

# App-specific
app-up:
	docker network inspect greenflag-net >/dev/null 2>&1 || docker network create greenflag-net
	docker compose up -d

app-down:
	docker compose down

# Utilities
restart: down up

ps:
	@echo "=== Infrastructure Services ==="
	docker compose -f docker-compose.infra.yml ps
	@echo ""
	@echo "=== Application Services ==="
	docker compose ps

logs:
	docker compose logs -f

logs-infra:
	docker compose -f docker-compose.infra.yml logs -f

clean:
	docker compose down -v
	docker compose -f docker-compose.infra.yml down -v
	docker network rm greenflag-net || true

migrate:
	docker compose exec -T db psql -U postgres -d greenflag < backend-nestjs/src/scripts/migrate_seed_data.sql
