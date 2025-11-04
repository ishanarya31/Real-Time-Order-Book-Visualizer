import { DepthDeltaEvent, OrderBookMaps, OrderBookSnapshot, OrderBookSnapshotRow } from '../types/market';

export function createEmptyOrderBook(): OrderBookMaps {
	return { bids: new Map(), asks: new Map() };
}

export function applyDepthDelta(state: OrderBookMaps, delta: DepthDeltaEvent): void {
	for (const [price, qty] of delta.b) {
		const quantity = Number(qty);
		if (quantity === 0) state.bids.delete(price);
		else state.bids.set(price, quantity);
	}
	for (const [price, qty] of delta.a) {
		const quantity = Number(qty);
		if (quantity === 0) state.asks.delete(price);
		else state.asks.set(price, quantity);
	}
}

export function computeSnapshot(state: OrderBookMaps, maxLevels = 50): OrderBookSnapshot {
	// bids: desc, asks: asc
	const bidsSorted = Array.from(state.bids.entries())
		.map(([p, q]) => ({ price: Number(p), amount: q }))
		.sort((a, b) => b.price - a.price)
		.slice(0, maxLevels);
	const asksSorted = Array.from(state.asks.entries())
		.map(([p, q]) => ({ price: Number(p), amount: q }))
		.sort((a, b) => a.price - b.price)
		.slice(0, maxLevels);

	let running = 0;
	const bids: OrderBookSnapshotRow[] = bidsSorted.map((l) => {
		running += l.amount;
		return { price: l.price, amount: l.amount, total: running };
	});

	running = 0;
	const asks: OrderBookSnapshotRow[] = asksSorted.map((l) => {
		running += l.amount;
		return { price: l.price, amount: l.amount, total: running };
	});

	const bestBid = bids[0]?.price;
	const bestAsk = asks[0]?.price;
	const spread = bestAsk != null && bestBid != null ? bestAsk - bestBid : undefined;

	return { bids, asks, bestBid, bestAsk, spread };
}

export function maxCumulative(rows: OrderBookSnapshotRow[]): number {
	let max = 0;
	for (const r of rows) if (r.total > max) max = r.total;
	return max || 1;
}

