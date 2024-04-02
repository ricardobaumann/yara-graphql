#!/bin/sh
set -e
docker-compose up -d
npm install
npm start