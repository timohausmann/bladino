#!/bin/bash
# Formats only the edited file with Prettier after the Cursor agent changes it.

input=$(cat)
file_path=$(node -e "
const data = JSON.parse(process.argv[1]);
const root = data.workspace_roots?.[0];
let path = data.file_path ?? '';
if (!path) process.exit(0);
if (!path.startsWith('/') && root) path = \`\${root}/\${path}\`;
console.log(path);
" "$input")

case "$file_path" in
    *.ts|*.tsx|*.js|*.jsx|*.css|*.json|*.md|*.graphql) ;;
    *) exit 0 ;;
esac

[ -f "$file_path" ] || exit 0

workspace_root=$(node -e "console.log(JSON.parse(process.argv[1]).workspace_roots?.[0] ?? '.')" "$input")
cd "$workspace_root"

npx prettier --write "$file_path" >/dev/null 2>&1 || true
exit 0
