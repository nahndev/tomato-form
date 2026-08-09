#!/usr/bin/env bash
# Generates typed TS clients for every .proto file under src/, next to its source
# in a generated/ subfolder. Run via `pnpm proto:gen` whenever a .proto changes,
# and commit the output.
set -euo pipefail

cd "$(dirname "$0")/.."

while IFS= read -r -d '' proto; do
  dir=$(dirname "$proto")
  out="$dir/generated"
  mkdir -p "$out"
  echo "Generating $proto -> $out"
  ./node_modules/.bin/grpc_tools_node_protoc \
    --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
    --ts_proto_out="$out" \
    --ts_proto_opt=outputServices=grpc-js,env=node,esModuleInterop=true \
    -I "$dir" \
    "$proto"
done < <(find src -name '*.proto' -print0)
