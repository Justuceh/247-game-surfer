import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WishlistGame from '../../../models/WishlistGame';

interface WishlistContextValue {
	games: WishlistGame[];
	addGame: (wishlistGame: WishlistGame) => void;
	removeGame: (gameId: string) => void;
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
	const [games, setGames] = useState<WishlistGame[]>([]);

	const addGame = (game: WishlistGame) => {
		setGames((prevGames) => [...prevGames, game]);
		if (!games.length) {
			storeGameLocally(game);
		} else {
			mergeGameLocally(game);
		}
	};

	const removeGame = async (gameId: string) => {
		setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
		await removeGameLocally(gameId);
	};

	const contextValue: WishlistContextValue = {
		games,
		addGame,
		removeGame,
	};
	const storeGameLocally = async (game: WishlistGame) => {
		try {
			const jsonValue = JSON.stringify(game);
			await AsyncStorage.setItem(`${game.id}`, jsonValue);
		} catch (error) {
			console.log('error saving game in local storage', error);
		}
	};

	const mergeGameLocally = async (game: WishlistGame) => {
		try {
			const jsonValue = JSON.stringify(game);
			await AsyncStorage.mergeItem(`${game.id}`, jsonValue);
		} catch (error) {
			console.log('error saving game in local storage', error);
		}
	};

	const removeGameLocally = async (gameId: string) => {
		try {
			await AsyncStorage.removeItem(gameId);
		} catch (error) {
			console.log('error saving game in local storage', error);
		}
	};

	useEffect(() => {
		async function getGamesFromStorage(): Promise<WishlistGame[]> {
			try {
				const gameKeys = (await AsyncStorage.getAllKeys()).filter(
					(key) => key !== 'initialState'
				);
				const gamesInStorage = await AsyncStorage.multiGet(gameKeys);
				if (gamesInStorage !== null) {
					const localStorageGames = gamesInStorage
						.filter(([key, value]) => value !== null)
						.map(([key, value]) => JSON.parse(value as string) as WishlistGame);
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
