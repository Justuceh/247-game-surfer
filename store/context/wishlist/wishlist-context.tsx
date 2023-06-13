import { createContext, useState } from 'react';

import { GameDealItem } from '../../../screens/GameDealsScreen';

interface WishlistContextValue {
	games: GameDealItem[];
	addGame: (game: GameDealItem) => void;
	removeGame: (gameID: string) => void;
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
	const [games, setGames] = useState<GameDealItem[]>([]);

	const addGame = (game: GameDealItem) => {
		setGames((prevGames) => [...prevGames, game]);
	};

	const removeGame = (gameID: string) => {
		setGames((prevGames) => prevGames.filter((game) => game.gameID !== gameID));
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
