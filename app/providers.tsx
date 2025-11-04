"use client";

import React from 'react';
import { MarketProvider } from '../context/MarketContext';

export function Providers({ children }: { children: React.ReactNode }) {
	return <MarketProvider symbol="btcusdt">{children}</MarketProvider>;
}


