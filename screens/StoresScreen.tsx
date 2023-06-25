import { useContext, useEffect } from 'react';
import {
	View,
	StyleSheet,
	ImageBackground,
	Pressable,
	FlatList,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { CHEAPSHARK_BASE_URL, CHEAPSHARK_API_URL } from '@env';
import axios from 'axios';

import Card from '../components/Card';
import ActivityIndicatorComponent from '../components/ActivityIndicator';
import { useNavigation } from '@react-navigation/native';

import { GameStoreContext } from '../store/context/game_deals/game-stores-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from '../App';
import { LinearGradient } from 'expo-linear-gradient';

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
		const response = await axios.get(`${CHEAPSHARK_API_URL}/stores`);
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
			storesContext.stores.length === 0
		) {
			storesContext.addGameStores(gameStores);
		}
	}, [gameStores, storesContext.stores]);

	const filteredGames = storesContext.stores.filter((store) => store.isActive);

	const handleGameStorePress = (storeID: string, storeName: string) => {
		navigation.navigate('GameDealsScreen', {
			storeID: storeID,
			title: storeName,
		});
	};

	const renderCards = ({ item }: { item: GameStoreInterface }) => {
		return (
			<Card
				style={{
					aspectRatio: 1,
				}}>
				<Pressable
					onPress={() => handleGameStorePress(item.storeID, item.storeName)}
					style={({ pressed }) => [pressed ? styles.pressed : null]}>
					<ImageBackground
						style={styles.image}
						source={{ uri: `${CHEAPSHARK_BASE_URL}${item.images.logo}` }}
					/>
				</Pressable>
			</Card>
		);
	};

	return (
		<>
			<LinearGradient
				style={styles.linearGradient}
				colors={['#313131', '#dfdfdf', '#313131']}>
				<View style={styles.rootContainer}>
					{isLoading ? (
						<ActivityIndicatorComponent size='large' color='blue' />
					) : (
						<FlatList
							data={filteredGames}
							renderItem={renderCards}
							numColumns={2}
							contentContainerStyle={{ padding: 5 }}
							keyExtractor={(item) => `${item.storeID}`}
						/>
					)}
				</View>
			</LinearGradient>
		</>
	);
};

export default StoresScreen;

const styles = StyleSheet.create({
	linearGradient: {
		flex: 1,
	},
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	image: {
		flex: 1,
		backgroundColor: '#e4e4e4',
		borderRadius: 40,
		aspectRatio: 1,
		elevation: 4,
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.5,
	},
	pressed: {
		opacity: 0.5,
	},
});
