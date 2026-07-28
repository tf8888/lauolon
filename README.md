# Lauolon

A net worth tracking app with an AI-powered financial advisor that helps you make smarter decisions about your portfolio. **Lauolon is not a budgeting or an expense tracking app.**

![hero](/public/images/github/readme-hero.png)

## Features

- **Interactive portfolio visualization** - See your wealth grow with engaging charts and tables, not boring spreadsheets
- **AI-powered financial insights** - Get personalized advice, not generic market data
- **Multi-currency support** - Automatic exchange rates for global portfolios
- **Smart portfolio import** - One-click import from any broker or spreadsheet with AI
- **Daily market data** - Powered by Yahoo Finance
- **Secure, private and open source** - Your data stays yours

## Built with

- Next.js 16 (App Router, Turbopack, Cache Components)
- TypeScript (Strict Mode)
- Supabase (Postgres, Auth, Storage)
- Tailwind CSS

## Vision

If you’re curious about why Lauolon exists and where it’s going, read the full vision here: [VISION.md](./VISION.md)

## Quick Start (Docker)

**Prerequisites:** Docker Desktop and your own Supabase project (see [CONTRIBUTING.md](/CONTRIBUTING.md) for details).

1. Clone and configure:

   ```bash
   git clone https://github.com/tf8888/lauolon.git
   cd lauolon
   ```

2. Copy the example environment file and fill in your own values:

   ```bash
   cp .env.example .env.local
   ```

   Then update `.env.local` with your [Supabase](https://supabase.com/) credentials and any optional integrations you want to enable.

3. Apply database migrations:

   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase db push --linked
   ```

4. Start with Docker using latest pre-built image:

   ```bash
   docker compose -f docker-compose.ghcr.yml up
   ```

   Or build locally:

   ```bash
   docker compose up --build
   ```

Visit <http://localhost:3000>

For local Node.js setup without Docker, see the [contributing guide](/CONTRIBUTING.md).

## Contributing

Please read the [contributing guide](/CONTRIBUTING.md).

## Roadmap

> The roadmap is tracked in [GitHub Issues](https://github.com/tf8888/lauolon/issues).

## License

MIT © 2026 tf8888. See [LICENSE](https://github.com/tf8888/lauolon/blob/main/LICENSE) for details.
