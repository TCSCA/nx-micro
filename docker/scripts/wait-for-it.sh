#!/bin/sh
# wait-for-it.sh - Wait for a service to be ready before executing a command
# Usage: ./wait-for-it.sh postgres-main:5432 -- npm start

set -e

host="$1"
shift
cmd="$@"

until nc -z -v -w30 $host; do
  echo "Waiting for $host to be ready..."
  sleep 1
done

echo "$host is ready!"
exec $cmd
