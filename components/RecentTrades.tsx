'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useMarket } from '../context/MarketContext';

const timeFmt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const priceFmt = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const qtyFmt = new Intl.NumberFormat(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 });

function TradeRow({ time, price, qty, isSell, flashRef }: { time: number; price: number; qty: number; isSell: boolean; flashRef?: (el: HTMLDivElement | null) => void }) {
	return (
		<div className="tradeRow" ref={flashRef}>
			<div>{timeFmt.format(new Date(time))}</div>
			<div className={isSell ? 'priceRed' : 'priceGreen'}>{priceFmt.format(price)}</div>
			<div>{qtyFmt.format(qty)}</div>
		</div>
	);
}

const MemoTradeRow = React.memo(TradeRow);

export default function RecentTrades() {
	const { trades } = useMarket();
	const lastTopRef = useRef<number | null>(null);
	const flashRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const top = trades[0];
		if (!top) return;
		if (lastTopRef.current === top.time) return;
		lastTopRef.current = top.time;
		if (flashRef.current) {
			const cls = top.isSell ? 'tradeFlashDown' : 'tradeFlashUp';
			flashRef.current.classList.remove('tradeFlashDown', 'tradeFlashUp');
			// force reflow
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			flashRef.current.offsetHeight;
			flashRef.current.classList.add(cls);
		}
	}, [trades]);

	return (
		<div className="card">
			<div className="cardHeader">Recent Trades</div>
			<div className="cardBody">
				<div className="rowLabel" style={{ display: 'grid', gridTemplateColumns: '100px 1fr 140px' }}>
					<div>Time</div>
					<div>Price</div>
					<div>Amount</div>
				</div>
				{trades.map((t, idx) => (
					<MemoTradeRow key={`${t.time}-${idx}`} time={t.time} price={t.price} qty={t.quantity} isSell={t.isSell} flashRef={idx === 0 ? (el) => (flashRef.current = el) : undefined} />
				))}
			</div>
		</div>
	);
}


