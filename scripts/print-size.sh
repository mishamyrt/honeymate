#!/bin/sh

DIST_FILE="dist/honeymate.js"
DIST_MIN_FILE="dist/honeymate.min.js"

pnpm run build &
pnpm run build -m -o "$DIST_MIN_FILE" &

wait

dist_size=$(cat "$DIST_FILE" | wc -c | xargs)
min_dist_size=$(cat "$DIST_MIN_FILE" | wc -c | xargs)
min_gz_size=$(gzip -c "$DIST_MIN_FILE" | wc -c | xargs)

echo "\nSize: $dist_size bytes"
echo "Minified size: $min_dist_size bytes"
echo "Minified + gzip size: $min_gz_size bytes"

rm "$DIST_MIN_FILE"
