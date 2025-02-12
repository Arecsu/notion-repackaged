#!/usr/bin/env bash
set -e

source `dirname $0`/_utils.sh
check-debug-expands
workspace-dir-pushd

check-cmd jq git
check-env NOTION_VERSION NOTION_REPACKAGED_REVISION

if [ -z "${NOTION_REPACKAGED_EDITION}" ]; then
  log "Cannot build without knowing the edition to build, please set NOTION_REPACKAGED_EDITION env var"
  exit -1
fi

if [ "${NOTION_REPACKAGED_EDITION}" == "enhanced" ]; then
  NOTION_REPACKAGED_EDITION_SRCDIR="${NOTION_ENHANCED_SRC_NAME}"
elif [ "${NOTION_REPACKAGED_EDITION}" == "vanilla" ]; then
  NOTION_REPACKAGED_EDITION_SRCDIR="${NOTION_VANILLA_SRC_NAME}"
else
  log "Invalid value for the NOTION_REPACKAGED_EDITION env var, it has to either be 'vanilla' or 'enhanced'"
  exit -1
fi

if [ ! -d "${NOTION_REPACKAGED_EDITION_SRCDIR}" ]; then
  log "Could not find the directory for this edition's sources, please build them first"
  exit -1
fi

pushd "${NOTION_REPACKAGED_EDITION_SRCDIR}" > /dev/null

log "Installing dependencies..."
npm install

log "Install electron and electron-builder..."
npm install electron@11 electron-builder --save-dev

log "Running electron-builder..."
node_modules/.bin/electron-builder \
  --config $WORKSPACE_DIR/electron-builder.js $@

popd > /dev/null
