# Cron Jobs

Schedules live in [`.github/workflows/cron.yml`](../.github/workflows/cron.yml), which calls the handlers in `app/api/cron/` over HTTP via [`scripts/run-cron.sh`](../scripts/run-cron.sh). All times are UTC — cron does not observe local time or DST.

**Why GitHub Actions and not Vercel Cron:** Vercel's Hobby plan allows only two cron jobs and only daily granularity. This app needs five, two of them hourly. GitHub Actions has no such limit and is free for public repositories.

| Endpoint                          | Schedule (UTC) | Workflow job | Purpose                                                 | Runs when                                                                  |
| --------------------------------- | -------------- | ------------ | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| `/api/cron/fetch-exchange-rates`  | `0 22 * * *`   | `daily`      | Refreshes FX rates for a rolling 3-day window           | always                                                                     |
| `/api/cron/fetch-quotes`          | `0 22 * * *`   | `daily`      | Refreshes market quotes for a rolling 3-day window      | always                                                                     |
| `/api/cron/repair-quote-gaps`     | `17 * * * *`   | `hourly`     | Drains `quote_repair_queue` (gaps found by other paths) | always                                                                     |
| `/api/cron/send-automated-emails` | `17 * * * *`   | `hourly`     | Sends due user-facing scheduled email                   | `AUTOMATED_EMAILS_ENABLED=true` **and** the email vars are set             |
| `/api/cron/review-stale-symbols`  | `0 6 * * 1`    | `weekly`     | Emails an LLM digest of symbols that stopped quoting    | `AI_PROVIDER_API_KEY`, `RESEND_API_KEY`, `EMAILS_FROM_ADDRESS` are all set |

Endpoints that share a schedule share a single runner and are called sequentially, which keeps billable Actions minutes down. Every endpoint is attempted even if an earlier one in the same job fails; the job then exits non-zero. `send-automated-emails` moved from `0 * * * *` to `17 * * * *` to ride along with the repair queue — it is hourly either way.

A disabled cron still runs and returns `200`; it reports what it skipped rather than doing work. That keeps a misconfiguration visible in the workflow log instead of looking like a silent success.

## Deployment configuration

The workflow needs two repository settings (Settings → Secrets and variables → Actions):

| Kind     | Name          | Value                                                                |
| -------- | ------------- | -------------------------------------------------------------------- |
| Variable | `SITE_URL`    | Production origin, e.g. `https://www.lauolon.com`, no trailing slash |
| Secret   | `CRON_SECRET` | Must match `CRON_SECRET` in the Vercel environment                   |

Caveats worth knowing:

- **GitHub disables scheduled workflows after 60 days of repository inactivity.** Push something, or re-enable them in the Actions tab, or the crons silently stop.
- The scheduler is best-effort and can lag 10+ minutes at peak. None of these jobs is sensitive to that.
- Actions minutes are unlimited on public repositories. On a private repository the hourly job costs roughly 720 minutes/month against the 2,000-minute free allowance.
- Vercel's **Deployment Protection** must not cover production, or every request returns `401` before reaching the handler.

## Authentication

Every endpoint requires the bearer token, and fails closed with `500` if `CRON_SECRET` is unset on the server:

```
Authorization: Bearer <CRON_SECRET>
```

The workflow sends this header. To fire one by hand, use the **Run workflow** button on the _Scheduled jobs_ workflow (it takes the endpoint as an input), or call it directly:

```bash
curl "https://<your-domain>/api/cron/<endpoint>" \
  -H "authorization: Bearer $CRON_SECRET"
```

The same script the workflow uses also runs locally:

```bash
SITE_URL=https://<your-domain> CRON_SECRET=... \
  ENDPOINTS="fetch-quotes" bash scripts/run-cron.sh
```

## Notes per job

**`fetch-exchange-rates`, `fetch-quotes`** — each call processes `D`, `D-1`, `D-2`, where `D` defaults to today (UTC) and `?date=YYYY-MM-DD` overrides it. That override is how backfills are driven; for the full procedure, including ordering and provider rate limits, see [FX-CACHE-RESEED.md](./FX-CACHE-RESEED.md) and [QUOTE-CACHE-RESEED.md](./QUOTE-CACHE-RESEED.md). `fetch-quotes` sets `maxDuration = 300`, the ceiling on Vercel's Hobby plan. A very large symbol universe can outgrow that budget; the fix is to drive it in slices with `?date=`, or to raise `maxDuration` after moving to Pro.

**`repair-quote-gaps`** — hourly rather than daily because the queue is filled on demand (net-worth history requesting an exact date it doesn't have), not on a schedule. Rows ending in `non_trading_or_no_exact` are expected: market holidays and dates the provider has no exact quote for.

**`send-automated-emails`** — the only job gated by `AUTOMATED_EMAILS_ENABLED`. That flag is the kill switch for **user-facing** mail only.

**`review-stale-symbols`** — operator mail, so `AUTOMATED_EMAILS_ENABLED` deliberately does **not** gate it; configuring AI and email is the whole switch. It researches symbols that stopped returning quotes and emails a digest of verdicts with ready-to-run retirement SQL — it applies nothing automatically and writes only to `symbol_review_verdicts`. Set `SYMBOL_REVIEW_ALERT_EMAIL` unless `EMAILS_FROM_ADDRESS` is a real inbox: without it the digest goes to that send-only mailbox and is silently dropped. Costs one LLM web-search call per symbol (capped per run), so trigger it by hand sparingly. Design notes: [stale-symbol-llm-review-plan.md](./stale-symbol-llm-review-plan.md).

## Database jobs (`pg_cron`)

Not everything scheduled is an HTTP endpoint. These run inside Postgres, are registered by migration, and need no `CRON_SECRET`:

| Job                                  | Schedule (UTC) | Purpose                                                                                               |
| ------------------------------------ | -------------- | ----------------------------------------------------------------------------------------------------- |
| `news_cleanup`                       | `0 22 * * *`   | Deletes `news` rows older than 7 days                                                                 |
| `symbols_cleanup`                    | `0 3 1 * *`    | Deletes symbols no position references (see [SYMBOL-RENAME-HANDLING.md](./SYMBOL-RENAME-HANDLING.md)) |
| `quote_repair_reopen_stale_no_exact` | `0 4 15 * *`   | Reopens an old slice of `non_trading_or_no_exact` rows for the hourly worker to retry                 |

To inspect them: `SELECT jobname, schedule, active FROM cron.job;`

## Adding a job

1. Add the handler under `app/api/cron/<name>/route.ts`, copying the bearer check from an existing one.
2. Add it to `.github/workflows/cron.yml`: append it to the `ENDPOINTS` list of the job whose schedule it shares, or add a new job plus a matching `schedule:` entry and `if: github.event.schedule == '<cron>'` guard. Add it to the `workflow_dispatch` choices too.
3. Add a row to the first table — the "runs when" column especially, if the job is gated by env vars.

For a `pg_cron` job, register it in a migration and add a row to the database table instead.
