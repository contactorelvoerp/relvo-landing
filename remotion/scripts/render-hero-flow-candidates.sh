#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

COUNT="${1:-12}"
FRAME="${2:-240}"
OUT_DIR="${3:-./renders/hero-flow-candidates}"

mkdir -p "$OUT_DIR"

for ((seed=1; seed<=COUNT; seed++)); do
  out_file="$OUT_DIR/hero-flow-seed-$(printf "%03d" "$seed").png"
  npx remotion still src/index.ts HeroFlow "$out_file" \
    --frame="$FRAME" \
    --props="$(printf '{"color":"#000000","seed":%s}' "$seed")"
done

echo "Rendered $COUNT candidate PNGs to $OUT_DIR"
