#!/bin/bash

if [[ -n $BACKEND_URL && -n $PROJECT ]]; then
  echo "{
    \"backendUrl\": \"$BACKEND_URL\",
    \"project\": \"$PROJECT\"
  }" > /usr/share/nginx/html/assets/config.json
fi

exec "$@"