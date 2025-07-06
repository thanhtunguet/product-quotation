#!/bin/bash

source apps/backend/.env
npx typeorm-model-generator -h $DB_HOST -p $DB_PORT -u $DB_USER -x "$DB_PASSWORD" -d $DB_NAME -e mysql
rm -rf apps/backend/src/entities/*
mv output/entities/* apps/backend/src/entities/
rm -rf output/
