# Private Dashboard Tools

The `/api/private-tools` Express routes store expenses, daily notes, and goals in separate MongoDB collections. They are not mounted in the public portfolio client. Requests are protected by `PRIVATE_DATA_API_KEY`; the dashboard's server-only `/api/private/*` proxy checks the HTTP-only session and forwards the key without exposing it to the browser.

## Deployment configuration

Set the same high-entropy `PRIVATE_DATA_API_KEY` on the Server and dashboard deployments. Set `PRIVATE_DATA_API_BASE_URL` on the dashboard to the backend origin (or use `NEXT_PUBLIC_API_BASE_URL`). The dashboard also requires `JWT_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD`.

For a credential-based read-only dashboard account, set `DEMO_USERNAME` and `DEMO_PASSWORD` on the dashboard. Login creates a viewer session; server-side authorization permits GET requests only, including private workspace reads, and returns 403 for every mutation. Keep demo credentials limited to people you trust with the displayed personal data.

Expense and note lists are month-filtered and indexed. Expense totals are calculated by a MongoDB aggregation. Hiding an item sets `hiddenAt` instead of deleting the record; restore clears that timestamp.
