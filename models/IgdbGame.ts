/** Game data shape from IGDB game api */
export default interface IgdbGame {
	id: number;
	cover: number;
	name: string;
	screenshots: number[];
	summary: string;
	videos: number[];
	first_release_date: string;
}
