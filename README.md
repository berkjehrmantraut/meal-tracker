# Meal Tracker

## Exporting CSV data

1. Adjust your daily goals and tap the add buttons to log servings.
2. Pick a date (defaults to today).
3. Select **Export CSV** to download or share the export on supported devices.

The CSV includes columns for the date, servings, and target goals:

```
date,fruit,vegetables,grains,protein,dairy,fruit_target,vegetables_target,grains_target,protein_target,dairy_target
```

## Optional Google Sheets integration

If you want to append the CSV rows to a Google Sheet, you can run a small
Node.js service that authenticates with OAuth and appends rows. A reference
implementation lives in `services/googleSheetsService.js`.

### Setup steps

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. Enable the **Google Sheets API**.
4. Create OAuth credentials:
   - Choose **OAuth client ID**.
   - Select **Desktop app** (for local development) or **Web application**.
   - Add your redirect URI (for a local script: `http://localhost:3000/oauth2callback`).
5. Download the OAuth client JSON and note the `client_id` and `client_secret`.
6. Create a Google Sheet and copy the spreadsheet ID from the URL.

### Environment variables

Set the following before running the service script:

```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_SHEET_ID=your-spreadsheet-id
```

### Installing dependencies

```
npm install googleapis
```

### Usage

```
node services/googleSheetsService.js
```

