import { createContext, useState } from 'react';

interface Game {
	ids: number[] | null;
	slug: string;
	name: string;
	description: string;
	background_image: string;
	releaseDate: string;
	metacritic: number | null;
	website: string;
	redditUrl: string;
	addWishlistItem: (id: number) => void;
	removeWishlistItem: (id: number) => void;
}

const WishlistContext = createContext<Game>({
	ids: null,
	slug: '',
	name: '',
	description: '',
	background_image: '',
	releaseDate: '',
	metacritic: null,
	website: '',
	redditUrl: '',
	addWishlistItem: (id: number) => {},
	removeWishlistItem: (id: number) => {},
});

// actual type: { children: React.ReactNode }
const WishlistContextProvider = ({ children }: any) => {
	const [wishlistIds, setWishlistIds] = useState<number[]>([]);

	const addWishlistItem = (id: number) => {
		setWishlistIds((currentIds) => [...currentIds, id]);
	};

	const removeWishlistItem = (id: number) => {
		setWishlistIds((currentIds) =>
			currentIds.filter((wishlistId) => wishlistId !== id)
		);
	};

	const contextValue: Game = {
		ids: wishlistIds,
		slug: '',
		name: '',
		description: '',
		background_image: '',
		releaseDate: '',
		metacritic: null,
		website: '',
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
