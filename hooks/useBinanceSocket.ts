'use client';

import { useEffect, useRef } from 'react';
import { AggTradeEvent, DepthDeltaEvent, SymbolCode } from '../types/market';

type Handlers = {
	onTrade: (t: AggTradeEvent) => void;
	onDepth: (d: DepthDeltaEvent) => void;
};

export function useBinanceSocket(symbol: SymbolCode, handlers: Handlers) {
	const wsRef = useRef<WebSocket | null>(null);
	const reconnectRef = useRef({ attempts: 0, closed: false });

	useEffect(() => {
		reconnectRef.current.closed = false;

		const streams = `${symbol}@aggTrade/${symbol}@depth@100ms`;
		const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

		function connect() {
			const ws = new WebSocket(url);
			wsRef.current = ws;

			ws.onopen = () => {
				reconnectRef.current.attempts = 0;
			};

			ws.onmessage = (evt) => {
				try {
					const data = JSON.parse(evt.data as string);
					// combined stream wraps in { stream, data }
					const payload = data?.data ?? data;
					if (!payload) return;
					if (payload.e === 'aggTrade') {
						handlers.onTrade(payload as AggTradeEvent);
					} else if (payload.b && payload.a) {
						handlers.onDepth(payload as DepthDeltaEvent);
					}
				} catch (e) {
					// swallow malformed
				}
			};

			ws.onerror = () => {
				ws.close();
			};

			ws.onclose = () => {
				if (reconnectRef.current.closed) return;
				const attempt = ++reconnectRef.current.attempts;
				const delay = Math.min(1000 * Math.pow(2, attempt), 15000);
				setTimeout(connect, delay);
			};
		}

		connect();

		return () => {
			reconnectRef.current.closed = true;
			wsRef.current?.close();
		};
	}, [symbol, handlers]);
}


