import GameItem from './GameItem';

/**
 * Game is needed because GameItem doesn't have
 * a PK such as id.  the [key: string] field is the game id.
 * This is the returned data shape when calling Cheap Shark API to
 * get multiple games by their ids.
 */
export default interface Game {
	[key: string]: GameItem;
}
