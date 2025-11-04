import OrderBook from '../components/OrderBook';
import RecentTrades from '../components/RecentTrades';

export default function Page() {
	return (
		<div className="container">
			<h1 className="title">Order Book Visualizer</h1>
			<div className="grid">
				<OrderBook />
				<RecentTrades />
			</div>
		</div>
	);
}

