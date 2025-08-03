#!/usr/bin/env bash

# Set Puppeteer's cache dir manually to a persistent location
export PUPPETEER_CACHE_DIR="./.puppeteer-cache"

npx puppeteer browsers install chrome

echo "✅ Puppeteer Chrome installed in $PUPPETEER_CACHE_DIR"
