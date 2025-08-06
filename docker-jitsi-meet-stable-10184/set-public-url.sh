#!/usr/bin/env bash

# Check for argument
if [ -z "$1" ]; then
  echo "Usage: $0 <public_url>"
  exit 1
fi

PUBLIC_URL="$1"
ENV_FILE="$(dirname "$0")/.env"


# Update or add the PUBLIC_URL variable
if grep -q '^PUBLIC_URL=' "$ENV_FILE"; then
  sed -i.bak -e "s#^PUBLIC_URL=.*#PUBLIC_URL=${PUBLIC_URL}#g" "$ENV_FILE"
else
  echo "PUBLIC_URL=${PUBLIC_URL}" >> "$ENV_FILE"
fi

echo "Set PUBLIC_URL to ${PUBLIC_URL} in ${ENV_FILE}"
