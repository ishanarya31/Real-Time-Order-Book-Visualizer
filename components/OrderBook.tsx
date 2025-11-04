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
			<div className="bar red" style={{ width: `${width}%` }} />
			<div className="priceRed">{priceFmt.format(row.price)}</div>
			<div>{qtyFmt.format(row.amount)}</div>
			<div>{qtyFmt.format(row.total)}</div>
		</div>
	);
}

const MemoBidRow = React.memo(BidRow, (a, b) => 
	a.row.price === b.row.price && 
	a.row.amount === b.row.amount && 
	a.row.total === b.row.total && 
	a.maxTotal === b.maxTotal
);

const MemoAskRow = React.memo(AskRow, (a, b) => 
	a.row.price === b.row.price && 
	a.row.amount === b.row.amount && 
	a.row.total === b.row.total && 
	a.maxTotal === b.maxTotal
);

export default function OrderBook() {
	const { orderBook } = useMarket();
	const { bids, asks, bestBid, bestAsk, spread } = orderBook;

	const maxBidTotal = useMemo(() => 
		bids.reduce((m, r) => (r.total > m ? r.total : m), 0), 
		[bids]
	);
	
	const maxAskTotal = useMemo(() => 
		asks.reduce((m, r) => (r.total > m ? r.total : m), 0), 
		[asks]
	);

	return (
		<div className="card">
			<div className="cardHeader">Order Book</div>
			
			{/* Column Headers - Two separate headers for each column */}
			<div style={{ 
				display: 'grid', 
				gridTemplateColumns: '1fr 1fr', 
				gap: '1px', 
				background: '#1e242c' 
			}}>
				<div className="headerRow" style={{ borderBottom: 'none' }}>
					<div>Price (USDT)</div>
					<div>Amount (BTC)</div>
					<div>Total (BTC)</div>
				</div>
				<div className="headerRow" style={{ borderBottom: 'none' }}>
					<div>Price (USDT)</div>
					<div>Amount (BTC)</div>
					<div>Total (BTC)</div>
				</div>
			</div>

			{/* Order Book Content - Side by side */}
			<div className="cardBody" style={{ 
				display: 'grid', 
				gridTemplateColumns: '1fr 1fr',
				gap: '1px',
				background: '#1e242c'
			}}>
				{/* Bids Column (Left) - Sorted DESCENDING by price */}
				<div style={{ background: '#11161d' }}>
					{bids.map((row) => (
						<MemoBidRow key={row.price} row={row} maxTotal={maxBidTotal} />
					))}
				</div>
				
				{/* Asks Column (Right) - Sorted ASCENDING by price */}
				<div style={{ background: '#11161d' }}>
					{asks.map((row) => (
						<MemoAskRow key={row.price} row={row} maxTotal={maxAskTotal} />
					))}
				</div>
			</div>

			{/* Spread Display - Between the columns conceptually, at the bottom */}
			<div className="spread">
				{bestBid != null && bestAsk != null ? (
					<>
						<span className="priceGreen">Best Bid {priceFmt.format(bestBid)}</span>
						{' • '}
						<span className="priceRed">Best Ask {priceFmt.format(bestAsk)}</span>
						{' • '}
						<span>Spread {priceFmt.format(spread!)}</span>
					</>
				) : (
					'Waiting for data...'
				)}
			</div>
		</div>
	);
}