import { createContext, useState } from 'react';
import { GameStoreInterface } from '../../../screens/StoresScreen';

interface GameStoreContextValue {
	stores: GameStoreInterface[];
	addGameStores: (stores: GameStoreInterface[]) => void;
}

const GameStoreContext = createContext<GameStoreContextValue>({
	stores: [],
	addGameStores: () => {},
});

const GameStoreContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [stores, setGameStores] = useState<GameStoreInterface[]>([]);

	const addGameStores = (gameStores: GameStoreInterface[]) => {
		setGameStores((prevStores) => [...prevStores, ...gameStores]);
	};

	const contextValue: GameStoreContextValue = {
		stores: stores,
		addGameStores,
	};

	return (
		<GameStoreContext.Provider value={contextValue}>
			{children}
		</GameStoreContext.Provider>
	);
};

export { GameStoreContext, GameStoreContextProvider };
