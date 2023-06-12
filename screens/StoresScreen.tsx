import { useContext, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { STORES_BASE_API_URL, STORES_API_URL } from '@env';
import axios from 'axios';

import Card from '../components/Card';
import ActivityIndicatorComponent from '../components/ActivityIndicator';
import { useNavigation } from '@react-navigation/native';

import { GameStoreContext } from '../store/context/game_deals/game-stores-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from '../App';

export interface GameStoreInterface {
	storeID: string;
	storeName: string;
	images: {
		banner: string;
		logo: string;
		icon: string;
	};
	isActive: boolean;
}

async function fetchGameStores(): Promise<GameStoreInterface[]> {
	try {
		const response = await axios.get(`${STORES_API_URL}`);
		return response.data;
	} catch (error) {
		console.log('thrown error');
		throw error;
	}
}
type StoresScreenNavigationProp = StackNavigationProp<
	RootNavigatorParamList,
	'GameDealsScreen'
>;

const StoresScreen = () => {
	const navigation = useNavigation<StoresScreenNavigationProp>();
	const {
		data: gameStores,
		isLoading,
		error,
	} = useQuery<GameStoreInterface[], unknown>(['gameStores'], fetchGameStores, {
		cacheTime: 1000 * 60 * 60 * 24, // Cache the store list for one day before fetching again
	});

	const storesContext = useContext(GameStoreContext);

	useEffect(() => {
		if (
			gameStores &&
			gameStores.length > 0 &&
			storesContext.games.length === 0
		) {
			storesContext.addGameStores(gameStores);
		}
	}, [gameStores, storesContext.games]);

	const filteredGames = storesContext.games.filter((game) => game.isActive);

	const renderCards = ({ item }: { item: GameStoreInterface }) => {
		const storeID = item.storeID;
		const handleGameStorePress = () => {
			navigation.navigate('GameDealsScreen', { storeID });
		};
		return (
			<Card color='#e4e4e4'>
				<Pressable
					onPress={handleGameStorePress}
					style={({ pressed }) => [pressed ? styles.pressed : null]}>
					<ImageBackground
						style={styles.image}
						source={{ uri: `${STORES_BASE_API_URL}${item.images.logo}` }}
					/>
				</Pressable>
			</Card>
		);
	};

	return (
		<View style={styles.rootContainer}>
			{isLoading ? (
				<ActivityIndicatorComponent size='large' color='blue' />
			) : (
				<FlashList
					data={filteredGames}
					renderItem={renderCards}
					numColumns={2}
					estimatedItemSize={190}
					contentContainerStyle={{ padding: 5 }}
					keyExtractor={(item) => `${item.storeID}`}
				/>
			)}
		</View>
	);
};

export default StoresScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#282828',
	},
	image: {
		flex: 1,
		aspectRatio: 1,
	},
	pressed: {
		opacity: 0.5,
	},
});
