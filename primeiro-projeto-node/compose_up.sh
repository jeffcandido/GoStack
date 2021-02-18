#!/bin/bash

set -eo pipefail

docker-compose build

docker-compose -f docker-compose.yml run --service-ports --rm backend bash
