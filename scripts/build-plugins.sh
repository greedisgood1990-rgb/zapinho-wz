#!/usr/bin/env bash
# Builds every official plugin in plugins-source/ into installable .zip packages
# and collects them into plugins-dist/ at the repo root, ready to upload into
# a running instance's PLUGINS_DIR (see docs/19-plugin-architecture.md).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGINS_SRC="$ROOT_DIR/plugins-source"
DIST_DIR="$ROOT_DIR/plugins-dist"

if [ ! -f "$PLUGINS_SRC/package.mjs" ]; then
  echo "plugins-source/ is empty — run: git submodule update --init --recursive" >&2
  exit 1
fi

cd "$PLUGINS_SRC"

if [ ! -d node_modules ]; then
  echo "==> Installing plugins-source dependencies"
  npm install
fi

echo "==> Building all plugins"
npm run build

mkdir -p "$DIST_DIR"
rm -f "$DIST_DIR"/*.zip
mv ./*.zip "$DIST_DIR"/

echo "==> Done. Packages in $DIST_DIR:"
ls -la "$DIST_DIR"
