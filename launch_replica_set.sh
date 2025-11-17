#!/bin/bash

export $(grep -v '^#' .env | xargs)

docker-compose -f docker-compose-replica-set.yml up -d --remove-orphans