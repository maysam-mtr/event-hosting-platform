.PHONY: run-whole-project set-up-jitsi build-game-engine set-up-eventure

set-up-jitsi:
	bash -c '\
	  cd docker-jitsi-meet-stable-10184 && \
	  cp env.example .env && \
	  ./gen-passwords.sh && \
	  JITSI_DOMAIN=$$( \
	    while IFS="=" read -r key value || [[ -n "$$key" ]]; do \
	      key=$${key##[[:space:]]}; key=$${key%%[[:space:]]*}; \
	      value=$${value##[[:space:]]}; value=$${value%%[[:space:]]*}; \
	      [[ -z "$$key" || "$$key" == \#* ]] && continue; \
	      if [[ "$$key" == "JITSI_DOMAIN" ]]; then echo "$$value"; break; fi; \
	    done < ../.env \
	  ) && \
	  echo "Using JITSI_DOMAIN=$$JITSI_DOMAIN" && \
	  ./set-public-url.sh https://$$JITSI_DOMAIN && \
	  docker compose up --build -d \
	'

build-game-engine:
	docker build -t game-engine ./Game-engine/backend

set-up-eventure:
	docker compose up --build -d

run-whole-project: set-up-jitsi build-game-engine set-up-eventure