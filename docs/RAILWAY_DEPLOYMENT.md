# Railway deployment checklist

## API

- Public domain generated.
- `WEB_ORIGIN` equals the exact public web origin, without trailing slash.
- `AI_PROVIDER=mock` until real AI is intentionally enabled.
- Health check: `/api/health`.
- One replica initially.
- Optional volume mounted at `/data` with `DATA_DIR=/data`.
- Optional private beta: `APP_ACCESS_KEY=...`.

Expected API root response includes `status: running`.

## Web

- Public domain generated.
- `NEXT_PUBLIC_API_URL` equals the API public HTTPS origin, without trailing slash.
- Rebuild, not only restart, after changing any `NEXT_PUBLIC_*` variable.

## Realtime verification

In browser DevTools > Network, filter `socket.io`.

Expected behavior:
1. polling request succeeds;
2. Socket.IO may upgrade to WebSocket;
3. UI shows `connected`;
4. starting an agent immediately updates the trace;
5. if the socket is interrupted, the UI reconnects and REST polling still resolves the run.

## Multi-replica

Add Redis and set `REDIS_URL` before scaling the API beyond one replica. Socket.IO's in-memory adapter is not enough across separate Node processes.
