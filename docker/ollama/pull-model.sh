#!/bin/sh
# Pulls the model used by the template builder copilot into the running ollama container.
docker compose exec ollama ollama pull qwen2.5:7b
