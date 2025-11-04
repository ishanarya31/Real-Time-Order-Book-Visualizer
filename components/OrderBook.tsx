"use client";

import React, { useMemo } from 'react';
import { useMarket } from '../context/MarketContext';
import { OrderBookSnapshotRow } from '../types/market';

const priceFmt = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const qtyFmt = new Intl.NumberFormat(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 });

function BidRow({ row, maxTotal }: { row: OrderBookSnapshotRow; maxTotal: number }) {
	const width = maxTotal ? Math.round((row.total / maxTotal) * 100) : 0;
	return (
		<div className="row">
			<div className="bar green" style={{ width: `${width}%` }} />
			<div className="priceGreen">{priceFmt.format(row.price)}</div>
			<div>{qtyFmt.format(row.amount)}</div>
			<div>{qtyFmt.format(row.total)}</div>
		</div>
	);
}

function AskRow({ row, maxTotal }: { row: OrderBookSnapshotRow; maxTotal: number }) {
	const width = maxTotal ? Math.round((row.total / maxTotal) * 100) : 0;
	return (
		<div className="row">
			<div className="bar red" style={{ width: `${width}%`, left: 'auto', right: 0 }} />
			<div className="priceRed">{priceFmt.format(row.price)}</div>
			<div>{qtyFmt.format(row.amount)}</div>
			<div>{qtyFmt.format(row.total)}</div>
		</div>
	);
}

const MemoBidRow = React.memo(BidRow, (a, b) => a.row.price === b.row.price && a.row.amount === b.row.amount && a.row.total === b.row.total && a.maxTotal === b.maxTotal);
const MemoAskRow = React.memo(AskRow, (a, b) => a.row.price === b.row.price && a.row.amount === b.row.amount && a.row.total === b.row.total && a.maxTotal === b.maxTotal);

export default function OrderBook() {
	const { orderBook } = useMarket();
	const { bids, asks, bestBid, bestAsk, spread } = orderBook;

	const maxBidTotal = useMemo(() => bids.reduce((m, r) => (r.total > m ? r.total : m), 0), [bids]);
	const maxAskTotal = useMemo(() => asks.reduce((m, r) => (r.total > m ? r.total : m), 0), [asks]);

	return (
		<div className="card">
			<div className="cardHeader">Order Book</div>
			<div className="headerRow">
				<div>Price</div>
				<div>Amount</div>
				<div>Total</div>
			</div>
			<div className="cardBody" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
				<div>
					{bids.map((row) => (
						<MemoBidRow key={row.price} row={row} maxTotal={maxBidTotal} />
					))}
				</div>
				<div>
					{asks.map((row) => (
						<MemoAskRow key={row.price} row={row} maxTotal={maxAskTotal} />
					))}
				</div>
			</div>
			<div className="spread">
				{bestBid != null && bestAsk != null ? (
					<>
						Best Bid {priceFmt.format(bestBid)} • Best Ask {priceFmt.format(bestAsk)} • Spread {priceFmt.format(spread!)}
					</>
				) : (
					'Waiting for data...'
				)}
			</div>
		</div>
	);
}

 
