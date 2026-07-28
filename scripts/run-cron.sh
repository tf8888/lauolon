#!/usr/bin/env bash
#
# Calls the app's cron endpoints over HTTP with the shared bearer token.
# Used by .github/workflows/cron.yml in place of Vercel Cron, and usable by
# hand for a one-off run:
#
#   SITE_URL=https://www.lauolon.com CRON_SECRET=... \
#     ENDPOINTS="fetch-quotes" bash scripts/run-cron.sh
#
# Every endpoint in ENDPOINTS is attempted even if an earlier one fails, so one
# broken job never masks the others; the script exits non-zero if any failed.

set -uo pipefail

if [[ -z "${SITE_URL:-}" ]]; then
  echo "SITE_URL is not set. Add it as a repository variable." >&2
  exit 1
fi

if [[ -z "${CRON_SECRET:-}" ]]; then
  echo "CRON_SECRET is not set. Add it as a repository secret." >&2
  exit 1
fi

if [[ -z "${ENDPOINTS:-}" ]]; then
  echo "ENDPOINTS is not set." >&2
  exit 1
fi

# Trailing slashes would produce a double slash in the request path.
base_url="${SITE_URL%/}"
failed=()

for endpoint in $ENDPOINTS; do
  echo "::group::${endpoint}"

  # --max-time exceeds the routes' maxDuration of 300s so a slow-but-working
  # run is never cut off by the client. The endpoints are idempotent upserts,
  # so a retried request is safe.
  if curl \
    --silent --show-error --fail-with-body \
    --max-time 320 \
    --retry 2 --retry-delay 30 --retry-all-errors \
    --header "authorization: Bearer ${CRON_SECRET}" \
    "${base_url}/api/cron/${endpoint}"; then
    echo
    echo "${endpoint}: ok"
  else
    status=$?
    echo
    echo "${endpoint}: FAILED (curl exit ${status})" >&2
    failed+=("${endpoint}")
  fi

  echo "::endgroup::"
done

if ((${#failed[@]} > 0)); then
  echo "Failed endpoints: ${failed[*]}" >&2
  exit 1
fi

echo "All endpoints completed."
