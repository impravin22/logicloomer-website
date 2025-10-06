#!/usr/bin/env bash
set -euo pipefail

OWNER="impravin22"
BASE_DIR="/Users/kumarpr/Desktop/Projects"

if ! command -v gh >/dev/null; then
  echo "gh CLI not found. Install from https://cli.github.com/" >&2
  exit 1
fi

echo "Authenticating gh..."
gh auth status || gh auth login

for dir in ""/*/ ; do
  [ -d "/.git" ] || continue
  repo_name=""
  full_name="/"
  echo "\n=== Processing  ==="
  pushd "" >/dev/null

  if ! gh repo view "" >/dev/null 2>&1; then
    gh repo create "" --public --source=. --remote=origin --push
  else
    git push -u origin main
  fi
  popd >/dev/null
done
