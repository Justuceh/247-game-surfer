import { createContext, useState } from 'react';

import { GameItem } from '../../screens/GamesScreen';

interface Game {
	ids: number[] | null;
	name: string;
	description: string;
	background_image: string;
	metacritic: number | null;
	redditUrl: string;
	addWishlistItem: (game: GameItem) => void;
	removeWishlistItem: (game: GameItem) => void;
}

const WishlistContext = createContext<Game>({
	ids: null,
	name: '',
	description: '',
	background_image: '',
	metacritic: null,
	redditUrl: '',
	addWishlistItem: (game: GameItem) => {},
	removeWishlistItem: (game: GameItem) => {},
});

// actual type: { children: React.ReactNode }
const WishlistContextProvider = ({ children }: any) => {
	const [wishlistIds, setWishlistIds] = useState<number[]>([]);

	const addWishlistItem = (game: GameItem) => {
		setWishlistIds((currentIds) => [...currentIds, game.id]);
	};

	const removeWishlistItem = (game: GameItem) => {
		setWishlistIds((currentIds) =>
			currentIds.filter((wishlistId) => wishlistId !== game.id)
		);
	};

	const contextValue: Game = {
		ids: wishlistIds,
		name: '',
		description: '',
		background_image: '',
		metacritic: null,
		redditUrl: '',
		addWishlistItem,
		removeWishlistItem,
	};

	return (
		<WishlistContext.Provider value={contextValue}>
			{children}
		</WishlistContext.Provider>
	);
};

export { WishlistContext, WishlistContextProvider };
