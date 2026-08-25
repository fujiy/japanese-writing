#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
skill_dir="$(cd -- "$script_dir/.." && pwd)"
skill_parent_dir="$(dirname -- "$skill_dir")"
output_path="${1:-$skill_parent_dir/japanese-writing.zip}"

if [[ "$output_path" != /* ]]; then
  output_path="$(pwd)/$output_path"
fi

case "$output_path" in
  "$skill_dir"/*)
    echo "Output ZIP must be outside the skill directory: $output_path" >&2
    exit 2
    ;;
esac

if ! command -v zip >/dev/null 2>&1; then
  echo "The 'zip' command is required." >&2
  exit 127
fi

mkdir -p -- "$(dirname -- "$output_path")"
rm -f -- "$output_path"

(
  cd -- "$skill_parent_dir"
  zip -rq "$output_path" "$(basename -- "$skill_dir")" \
    -x '*/.git' '*/.git/*' '*/node_modules' '*/node_modules/*'
)

echo "Created $output_path"
