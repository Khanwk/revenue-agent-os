# Upwork integration

Revenue Agent OS uses Upwork's official OAuth 2 + GraphQL API rather than scraping pages.

Configure your approved Upwork app:

```env
UPWORK_CLIENT_ID=
UPWORK_CLIENT_SECRET=
UPWORK_REDIRECT_URI=http://localhost:4100/api/integrations/upwork/callback
UPWORK_TENANT_ID=
UPWORK_GRAPHQL_URL=https://api.upwork.com/graphql
```

Then run the project and click **connect** beside Upwork in Scout's source strip. The backend redirects to Upwork, exchanges the callback code and stores the resulting token locally in:

```text
apps/api/data/upwork-token.json
```

That file is gitignored. The backend refreshes the access token shortly before expiry when a refresh token is available.

The Upwork app/key needs the marketplace job read scope plus Upwork's required common read scope.

The source adapter lives at:

```text
apps/api/src/sources/upwork-source.ts
```

Search uses `marketplaceJobPostingsSearch`; content lookup uses `marketplaceJobPostingsContents`. The returned ciphertext is converted into the original listing link:

```text
https://www.upwork.com/jobs/<ciphertext>
```

A manually supplied `UPWORK_ACCESS_TOKEN` can be used instead of the OAuth token file for development.
