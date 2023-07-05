import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GameDealItem from '../../../models/GameDealItem';

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

	const removeGame = async (gameDealID: string) => {
		setGames((prevGames) =>
			prevGames.filter((game) => game.dealID !== gameDealID)
		);
		await removeGameLocally(gameDealID);
	};

	const contextValue: WishlistContextValue = {
		games,
		addGame,
		removeGame,
	};
	const storeGameLocally = async (game: GameDealItem) => {
		try {
			const jsonValue = JSON.stringify(game);
			await AsyncStorage.setItem(`${game.dealID}`, jsonValue);
		} catch (error) {
			console.log('error saving game in local storage', error);
		}
	};

	const mergeGameLocally = async (game: GameDealItem) => {
		try {
			const jsonValue = JSON.stringify(game);
			await AsyncStorage.mergeItem(`${game.dealID}`, jsonValue);
		} catch (error) {
			console.log('error saving game in local storage', error);
		}
	};

	const removeGameLocally = async (gameDealID: string) => {
		try {
			await AsyncStorage.removeItem(gameDealID);
		} catch (error) {
			console.log('error saving game in local storage', error);
		}
	};

	useEffect(() => {
		async function getGamesFromStorage(): Promise<GameDealItem[]> {
			try {
				const gameKeys = (await AsyncStorage.getAllKeys()).filter(
					(key) => key !== 'initialState'
				);
				const gamesInStorage = await AsyncStorage.multiGet(gameKeys);
				if (gamesInStorage !== null) {
					const localStorageGames = gamesInStorage
						.filter(([key, value]) => value !== null)
						.map(([key, value]) => JSON.parse(value as string) as GameDealItem);
					return localStorageGames;
				}
			} catch (e) {
				// error reading value
			}
			return []; // return an empty array if gamesInStorage is null or an error occurs
		}
		getGamesFromStorage().then((gamesInStorage) => setGames(gamesInStorage));
	}, []);

	return (
		<WishlistContext.Provider value={contextValue}>
			{children}
		</WishlistContext.Provider>
	);
};

export { WishlistContext, WishlistContextProvider };
