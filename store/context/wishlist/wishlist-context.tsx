import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GameDealItem } from '../../../screens/GameDealsScreen';

interface WishlistContextValue {
	games: GameDealItem[];
	addGame: (game: GameDealItem) => void;
	removeGame: (gameDealID: string) => void;
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
		if (!games.length) {
			storeGameLocally(game);
		} else {
			mergeGameLocally(game);
		}
	};

	const removeGame = (gameDealID: string) => {
		setGames((prevGames) =>
			prevGames.filter((game) => game.dealID !== gameDealID)
		);
		removeGameLocally(gameDealID);
	};

	const contextValue: WishlistContextValue = {
		games,
		addGame,
		removeGame,
	};
	const storeGameLocally = async (game: GameDealItem) => {
		try {
			const jsonValue = JSON.stringify(game);
			await AsyncStorage.setItem(`${game.gameID}`, jsonValue);
		} catch (error) {
			console.log('error saving game in local storage', error);
		}
	};

	const mergeGameLocally = async (game: GameDealItem) => {
		try {
			const jsonValue = JSON.stringify(game);
			await AsyncStorage.mergeItem(`${game.gameID}`, jsonValue);
		} catch (error) {
			console.log('error saving game in local storage', error);
		}
	};

	const removeGameLocally = async (gameID: string) => {
		try {
			await AsyncStorage.removeItem(gameID);
		} catch (error) {
			console.log('error saving game in local storage', error);
		}
	};

	const getGamesFromStorage = async (): Promise<GameDealItem[]> => {
		try {
			const gameKeys = await AsyncStorage.getAllKeys();
			const gamesInStorage = await AsyncStorage.multiGet(gameKeys);
			if (gamesInStorage !== null) {
				return gamesInStorage
					.filter(([key, value]) => value !== null)
					.map(([key, value]) => JSON.parse(value as string) as GameDealItem);
			}
		} catch (e) {
			// error reading value
		}
		return []; // return an empty array if gamesInStorage is null or an error occurs
	};

	useEffect(() => {
		getGamesFromStorage().then((gamesInStorage) => setGames(gamesInStorage));
	}, []);

	return (
		<WishlistContext.Provider value={contextValue}>
			{children}
		</WishlistContext.Provider>
	);
};

export { WishlistContext, WishlistContextProvider };
