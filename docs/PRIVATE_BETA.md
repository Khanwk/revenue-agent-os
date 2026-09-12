# Private beta mode

The lightweight beta gate is opt-in.

API variable:

```env
APP_ACCESS_KEY=a-long-random-key
```

The browser asks for the key. It is stored in `sessionStorage`, sent as `X-Access-Key` on REST calls, and sent in Socket.IO handshake auth.

This is suited to a founder plus a few invited testers. Before selling the system broadly, implement real authentication, organizations/workspaces, per-user permissions, tenant-scoped data, encrypted credentials, rate limits and billing.
