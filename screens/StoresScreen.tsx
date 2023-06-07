import {
	View,
	StyleSheet,
	ImageBackground,
	Text,
	FlatList,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { API_KEY, STORES_API_URL } from '@env';
import axios from 'axios';

import Card from '../components/Card';
import ActivityIndicatorComponent from '../components/ActivityIndicator';

export interface GameStoreInterface {
	id: number;
	name: string;
	domain: string;
	slug: string;
	image_background: string;
	error?: any;
}

async function fetchGameStores(): Promise<any> {
	const params = {
		key: API_KEY,
		page_size: 20,
	};
	try {
		const response = await axios.get(`${STORES_API_URL}`, { params });
		return response.data.results;
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
	} = useQuery<GameStoreInterface[], unknown>(['stores'], fetchGameStores);

	const renderCards = ({ item }: { item: GameStoreInterface }) => {
		return (
			<Card color='#0a1112'>
				<View style={styles.innerCardContainer}>
					<ImageBackground
						style={styles.image}
						source={{ uri: item.image_background }}
					/>
					<Text>{item.name}</Text>
				</View>
			</Card>
		);
	};

	return (
		<View style={styles.rootContainer}>
			{isLoading ? (
				<ActivityIndicatorComponent size='large' color='blue' />
			) : (
				<FlatList
					data={gameStores}
					renderItem={renderCards}
					numColumns={2}
					contentContainerStyle={{ padding: 5 }}
					keyExtractor={(item) => `${item.id}`}
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
	},
	innerCardContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	image: {
		flex: 1,
		aspectRatio: 1,
	},
});
