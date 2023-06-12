import {
	View,
	StyleSheet,
	ImageBackground,
	Text,
	FlatList,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { STORES_BASE_API_URL, STORES_API_URL } from '@env';
import axios from 'axios';

import Card from '../components/Card';
import ActivityIndicatorComponent from '../components/ActivityIndicator';

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

const StoresScreen = () => {
	const {
		data: gameStores,
		isLoading,
		error,
	} = useQuery<GameStoreInterface[], unknown>(['gameStores'], fetchGameStores, {
		cacheTime: 1000 * 60 * 60 * 24, // Cache the store list for one day before fetching again
	});

	const filteredGames = gameStores?.filter((store) => store.isActive);

	const renderCards = ({ item }: { item: GameStoreInterface }) => {
		return (
			<Card color='#e4e4e4'>
				<View style={styles.innerCardContainer}>
					<ImageBackground
						style={styles.image}
						source={{ uri: `${STORES_BASE_API_URL}${item.images.logo}` }}
					/>
					<Text style={styles.storeText}>{item.storeName}</Text>
				</View>
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
	innerCardContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		flex: 1,
		aspectRatio: 1,
	},
	storeText: {
		marginTop: 9,
		fontWeight: '400',
		fontSize: 19,
		color: 'black',
	},
});
