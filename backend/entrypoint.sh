#!/bin/bash -eu

npm run setup

exec bash -c "$*"
