import GameDeal from './GameDeal';

/**
 * The response data shape for getting a single game
 * by id from Cheap Shark API
 */
export default interface GameItem {
	info: { title: string; thumb: string };
	deals: GameDeal[];
}
