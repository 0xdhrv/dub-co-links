# Dub Links Fetcher

Small Node.js project with a GitHub Actions workflow that fetches links from the Dub API every 4 hours and stores them in a JSON file (`data/dub-links.json`).

## Setup Instructions

### 1. Clone and install

```bash
git clone <your-fork-or-repo-url>
cd dub-co-links
npm install
```

### 2. Configure environment variables

- Copy `.env.example` to `.env.local` and fill in your token, or export the variable directly. The project uses `dotenv` to load `.env.local` (or `.env`) automatically for local runs.

```bash
cp .env.example .env.local
# edit .env.local and set DUB_API_TOKEN
```

Note: `.env.local` is ignored by git so your token won’t be committed.

### 3. Add API Token to GitHub Secrets (for CI)

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `DUB_API_TOKEN`
5. Value: Your Dub API token (e.g., `dub_OwJV8G0JjRf2K3ba5VMORTE7`)
6. Click **Add secret**

### 4. Enable Workflow Permissions

1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

## How It Works

- **Schedule**: Runs automatically every 4 hours
- **Manual trigger**: Can be triggered manually from the Actions tab
- **Data storage**: Fetched links are stored in `data/dub-links.json`
- **Caching**: Uses GitHub Actions cache for efficiency
- **Auto-commit**: Automatically commits changes when new data is fetched

## Files Structure

```
.
├── .github/
│   └── workflows/
│       └── fetch-dub-links.yml    # GitHub Actions workflow
├── scripts/
│   └── fetch-dub-links.js         # Fetch script
└── data/
    └── dub-links.json             # Stored links data
```

## Data Format

The stored JSON includes metadata and each link is reduced to only the following fields: `url`, `shortLink`, `archived`, `title`, `description`, `image`, `clicks`, `qrCode`.

```json
{
  "fetchedAt": "2025-10-31T21:28:53.000Z",
  "count": 100,
  "links": [
    {
      "url": "https://example.com/page",
      "shortLink": "exmpl",
      "archived": false,
      "title": "Example title",
      "description": "Optional description",
      "image": "https://cdn.example.com/image.png",
      "clicks": 42,
      "qrCode": "https://cdn.example.com/qrcode.png"
    }
  ]
}
```

## Local development

Run the fetcher locally (uses `.env.local` if present or the current shell env):

```bash
npm run fetch
```

## Monitoring

Check the workflow runs in the **Actions** tab of your repository to monitor the fetching process.
