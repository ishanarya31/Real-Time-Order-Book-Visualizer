export type SymbolCode = string; // lowercased e.g., 'btcusdt'

export interface AggTradeEvent {
	e: 'aggTrade';
	E: number; // event time
	s: string; // symbol, uppercased
	a: number; // aggregate trade ID
	p: string; // price
	q: string; // quantity
	T: number; // trade time
	m: boolean; // is buyer maker (true => sell trade)
}

export interface DepthDeltaEvent {
	e: 'depthUpdate' | string;
	E: number; // event time
	s: string; // symbol uppercased
	b: [string, string][]; // bids [price, qty]
	a: [string, string][]; // asks [price, qty]
}

export interface TradeItem {
	price: number;
	quantity: number;
	time: number;
	isSell: boolean; // true => sell (red), false => buy (green)
}

export type PriceString = string; // keep exact string

export interface OrderBookMaps {
	bids: Map<PriceString, number>;
	asks: Map<PriceString, number>;
}

export interface OrderBookSnapshotRow {
	price: number;
	amount: number;
	total: number; // cumulative
}

export interface OrderBookSnapshot {
	bids: OrderBookSnapshotRow[];
	asks: OrderBookSnapshotRow[];
	bestBid?: number;
	bestAsk?: number;
	spread?: number; // ask - bid, if both exist
}

