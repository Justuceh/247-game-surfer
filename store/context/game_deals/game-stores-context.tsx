import { createContext, useState } from 'react';
import { GameStoreInterface } from '../../../screens/StoresScreen';

interface GameStoreContextValue {
	games: GameStoreInterface[];
	addGameStores: (games: GameStoreInterface[]) => void;
}

const GameStoreContext = createContext<GameStoreContextValue>({
	games: [],
	addGameStores: () => {},
});

const GameStoreContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [games, setGames] = useState<GameStoreInterface[]>([]);

	const addGameStores = (gameStores: GameStoreInterface[]) => {
		setGames((prevGames) => [...prevGames, ...gameStores]);
	};

	const contextValue: GameStoreContextValue = {
		games,
		addGameStores,
	};

	return (
		<GameStoreContext.Provider value={contextValue}>
			{children}
		</GameStoreContext.Provider>
	);
};

export { GameStoreContext, GameStoreContextProvider };
