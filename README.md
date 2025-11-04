# Order Book Visualizer (Binance, Next.js + TypeScript)

A high-performance, real-time order book and recent trades visualizer powered by the Binance WebSocket API.

## Getting Started

Prerequisites: Node 18+

Development:
```bash
npm install
npm run dev
```
Then open http://localhost:3000.

Production:
```bash
npm install
npm run build
npm start
```
This runs a production build locally on port 3000.

## Tech Stack
- Next.js (App Router) + TypeScript
- Custom WebSocket hook for Binance streams
- React Context + reducer for high-frequency state (single shared socket)
- rAF-batched UI snapshots for smooth rendering
- Memoized row components and Intl number formatters for performance
- Simple CSS for a clean, professional UI

## Live Data
This app connects to Binance combined WebSocket streams:
- Aggregate Trades: `<symbol>@aggTrade`
- Order Book Deltas: `<symbol>@depth@100ms`

Example combined endpoint:
`wss://stream.binance.com:9443/stream?streams=btcusdt@aggTrade/btcusdt@depth@100ms`

## Design Choices / Trade-offs
- State model: Used React Context + reducer (not Zustand/Redux) to keep dependencies minimal while supporting high-frequency updates with a single shared source of truth. Components consume derived, read-optimized snapshots.
- Socket architecture: A single WebSocket connection is managed in context; all consumers read from it to avoid duplicate sockets and wasted work.
- Order book structure: `Map<string, number>` enables O(1) upserts/deletes keyed by exact price strings (prevents float drift). Snapshots convert to arrays with correct sorting and cumulative totals.
- Rendering cadence: Deltas are applied immediately, but UI snapshots are published via `requestAnimationFrame` so React renders at most once per frame, keeping the UI responsive under load.
- Rendering performance: Row components are memoized (`React.memo`) and numerical formatting uses shared `Intl.NumberFormat` instances to reduce allocations.

## Notes
- Trade direction is determined from `aggTrade.m` (isBuyerMaker). If `m === true`, the buyer is maker → sell trade (red). Otherwise buy (green).
- Order book deltas: quantity `"0"` removes a price level.

## Deploy
- Deployed on Vercel - https://realtimeorderbookvisualizer.vercel.app/

