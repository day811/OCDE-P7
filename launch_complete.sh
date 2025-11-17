#!/bin/bash

export $(grep -v '^#' .env | xargs)
docker-compose -f docker-compose-complete.yml up -d --remove-orphans