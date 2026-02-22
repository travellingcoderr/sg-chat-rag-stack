/**
 * Minimal entry so "Starting..." appears immediately when you run `make dev` or `npm run dev`.
 * Then the real app loads (express + routes). Use this as the dev entry so the terminal isn’t silent.
 */
process.stderr.write('Starting backend...\n')
await import('./index.js')
