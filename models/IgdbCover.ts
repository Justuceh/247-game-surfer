/** Cover data shape from covers IGDB api */
export default interface IgdbCover {
	id: number;
	height: number;
	width: number;
	game: number;
	image_id: number;
	url: string;
}
