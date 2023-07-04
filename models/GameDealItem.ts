/** Model used to track the game deal data that comes from Cheap Shark API */
export default interface GameDealItem {
	gameID: string;
	storeID: string;
	title: string;
	internalname: string;
	normalPrice: string;
	salePrice: 'string';
	thumb: string;
	isOnSale: '1' | '0';
	dealRating: string;
	dealID: string;
	savings: string;
	steamRatingPercent: string;
	steamRatingCount: string;
	metacriticScore: string;
}
