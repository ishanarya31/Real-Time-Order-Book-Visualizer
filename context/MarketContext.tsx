'use client';

import React, { createContext, useCallback, useContext, useMemo, useReducer, useRef } from 'react';
import { AggTradeEvent, DepthDeltaEvent, OrderBookSnapshot, TradeItem } from '../types/market';
import { createEmptyOrderBook, applyDepthDelta, computeSnapshot } from '../lib/orderBook';
import { useBinanceSocket } from '../hooks/useBinanceSocket';

type State = {
	trades: TradeItem[];
	orderBook: OrderBookSnapshot;
};

type Action =
	| { type: 'PUBLISH_SNAPSHOT'; snapshot: OrderBookSnapshot }
	| { type: 'ADD_TRADE'; trade: TradeItem };

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'PUBLISH_SNAPSHOT':
			return { ...state, orderBook: action.snapshot };
		case 'ADD_TRADE': {
			const next = [action.trade, ...state.trades];
			if (next.length > 50) next.length = 50;
			return { ...state, trades: next };
		}
		default:
			return state;
	}
}

type Ctx = State;

const MarketCtx = createContext<Ctx | null>(null);

export function MarketProvider({ symbol, children }: { symbol: string; children: React.ReactNode }) {
	const [state, dispatch] = useReducer(reducer, { trades: [], orderBook: { bids: [], asks: [] } });
	const bookRef = useRef(createEmptyOrderBook());
    const publishRaf = useRef<number | null>(null);

    const publish = useCallback(() => {
        const snapshot = computeSnapshot(bookRef.current, 50);
        dispatch({ type: 'PUBLISH_SNAPSHOT', snapshot });
    }, []);

    const schedulePublish = useCallback(() => {
        if (publishRaf.current != null) return;
        publishRaf.current = window.requestAnimationFrame(() => {
            publishRaf.current = null;
            publish();
        });
    }, [publish]);

	const onDepth = useCallback((d: DepthDeltaEvent) => {
		applyDepthDelta(bookRef.current, d);
		schedulePublish();
	}, [schedulePublish]);

	const onTrade = useCallback((t: AggTradeEvent) => {
		dispatch({
			type: 'ADD_TRADE',
			trade: {
				price: Number(t.p),
				quantity: Number(t.q),
				time: t.T ?? t.E,
				isSell: t.m
			}
		});
	}, []);

	useBinanceSocket(symbol, { onDepth, onTrade });

	const value = useMemo<Ctx>(() => state, [state]);
	return <MarketCtx.Provider value={value}>{children}</MarketCtx.Provider>;
}

export function useMarket() {
	const ctx = useContext(MarketCtx);
	if (!ctx) throw new Error('useMarket must be used within MarketProvider');
	return ctx;
}


