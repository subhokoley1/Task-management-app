#!/bin/bash
set -e

FIREBASE_DIR="${SRCROOT}/Firebase"
DEST="${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/GoogleService-Info.plist"

if [[ "${CONFIGURATION}" == *"Dev"* ]] || [[ "${APP_ENV}" == "development" ]]; then
  cp "${FIREBASE_DIR}/Dev/GoogleService-Info.plist" "${DEST}"
else
  cp "${FIREBASE_DIR}/Prod/GoogleService-Info.plist" "${DEST}"
fi

echo "Copied GoogleService-Info.plist for ${CONFIGURATION}"
