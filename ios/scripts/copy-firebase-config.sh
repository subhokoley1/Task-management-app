#!/bin/bash
set -e

FIREBASE_DIR="${SRCROOT}/Firebase"
APP_BUNDLE="${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app"
DEST="${APP_BUNDLE}/GoogleService-Info.plist"

mkdir -p "${APP_BUNDLE}"

# Debug / dev bundle uses Dev plist; Release / prod uses Prod plist
if [[ "${CONFIGURATION}" == "Debug" ]] \
  || [[ "${APP_ENV}" == "development" ]] \
  || [[ "${PRODUCT_BUNDLE_IDENTIFIER}" == *".dev" ]]; then
  cp "${FIREBASE_DIR}/Dev/GoogleService-Info.plist" "${DEST}"
else
  cp "${FIREBASE_DIR}/Prod/GoogleService-Info.plist" "${DEST}"
fi

echo "Copied GoogleService-Info.plist for ${CONFIGURATION}"
