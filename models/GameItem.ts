/**
 * The response data shape for getting a single game
 * by id from Cheap Shark API
 */
export default interface GameItem {
	info: { title: string; thumb: string };
	deals: {
		storeID: string;
		dealID: string;
		price: string;
		retailPrice: string;
		savings: string;
	}[];
}
