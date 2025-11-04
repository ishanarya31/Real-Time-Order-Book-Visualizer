import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
	title: 'Order Book Visualizer',
	description: 'Real-time order book and trades using Binance WebSocket'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<div className="nav">
					<div className="navInner">
						<div className="brand">
							<span className="brandDot" />
							<span>Order Book Visualizer</span>
						</div>
						<div className="muted">BTC/USDT • Live via Binance</div>
					</div>
				</div>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}


