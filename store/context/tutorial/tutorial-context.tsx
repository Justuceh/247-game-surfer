import { useEffect, useState, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TutorialContextValue {
	firstTimeUsingApp: boolean;
	setFirstTimeFalse: () => void;
}

const TutorialContext = createContext<TutorialContextValue>({
	firstTimeUsingApp: false,
	setFirstTimeFalse: () => {},
});

const TutorialContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [firstTimeUsingApp, setFirstTimeUsingApp] = useState<boolean>(false);

	async function setFirstTimeFalse() {
		setFirstTimeUsingApp(false);
		await AsyncStorage.setItem('initialState', 'false');
	}

	async function setStatusOfInitialState() {
		let appHasBeenInitialized = await AsyncStorage.getItem('initialState');
		if (appHasBeenInitialized === null) {
			await AsyncStorage.setItem('initialState', 'true');
			appHasBeenInitialized = await AsyncStorage.getItem('initialState');
		} else {
			appHasBeenInitialized = await AsyncStorage.getItem('initialState');
		}
		setFirstTimeUsingApp(appHasBeenInitialized === 'true');
	}

	useEffect(() => {
		setStatusOfInitialState();
	}, []);

	const cntextValue: TutorialContextValue = {
		firstTimeUsingApp,
		setFirstTimeFalse,
	};

	return (
		<TutorialContext.Provider value={cntextValue}>
			{children}
		</TutorialContext.Provider>
	);
};

export { TutorialContext, TutorialContextProvider };
