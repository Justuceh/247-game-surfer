import { createContext, useState } from 'react';

import { GameItem } from '../../screens/GamesScreen';

export interface Game {
	id: number;
	name: string;
	description: string;
	background_image: string;
	metacritic: number | null;
	redditUrl: string;
}

interface WishlistContextValue {
	games: Game[];
	addGame: (game: Game) => void;
	removeGame: (id: number) => void;
}

const WishlistContext = createContext<WishlistContextValue>({
	games: [],
	addGame: () => {},
	removeGame: () => {},
});

const WishlistContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [games, setGames] = useState<Game[]>([]);

	const addGame = (game: Game) => {
		setGames((prevGames) => [...prevGames, game]);
	};

	const removeGame = (id: number) => {
		setGames((prevGames) => prevGames.filter((game) => game.id !== id));
	};

	const contextValue: WishlistContextValue = {
		games,
		addGame,
		removeGame,
	};

	return (
		<WishlistContext.Provider value={contextValue}>
			{children}
		</WishlistContext.Provider>
	);
};

export { WishlistContext, WishlistContextProvider };
