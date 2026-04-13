#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

WEBM_OUT="${1:-../public/animations/hero-flow.webm}"
MP4_OUT="${2:-../public/animations/hero-flow.mp4}"

mkdir -p "$(dirname "$WEBM_OUT")"
mkdir -p "$(dirname "$MP4_OUT")"

npx remotion render src/index.ts HeroFlow "$WEBM_OUT" \
  --codec=vp8 \
  --props='{"color":"#000000","seed":8,"background":"#ffffff"}'

npx remotion render src/index.ts HeroFlow "$MP4_OUT" \
  --codec=h264 \
  --props='{"color":"#000000","seed":8,"background":"#ffffff"}'

echo "Rendered hero-flow assets:"
echo "  $WEBM_OUT"
echo "  $MP4_OUT"
