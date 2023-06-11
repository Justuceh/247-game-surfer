import { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	ImageBackground,
	Text,
	Pressable,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { API_KEY, GAMES_API_URL } from '@env';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

import Card from '../components/Card';
import SearchInput from '../components/SearchInput';
import ActivityIndicatorComponent from '../components/ActivityIndicator';

interface Game {
	id: number;
	slug: string;
	name: string;
	description: string;
	background_image: string;
	releaseDate: string;
	metacritic: number;
	website: string;
	redditUrl: string;
}

const GamessScreen = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [gameState, setGameState] = useState<Game[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	function handleOnGamePress() {
		console.log('pressed');
		///console.log(`game pressed.  Id: ${id}`)
	}
	const renderCards = ({ item }: { item: any }) => {
		return item ? (
			<>
				<Pressable
					onPress={handleOnGamePress}
					style={({ pressed }) => [pressed ? styles.pressed : null]}>
					<View style={styles.imageContainer}>
						<ImageBackground
							source={{ uri: item.background_image }}
							style={styles.image}
						/>
					</View>
				</Pressable>
				<View style={styles.titleContainer}>
					<Text style={styles.title}>{item.name}</Text>
					<Pressable style={({ pressed }) => [pressed ? styles.pressed : null]}>
						<View style={styles.pressableContent}>
							<Text style={styles.wishlistText}>+ Wishlist</Text>
						</View>
					</Pressable>
				</View>
			</>
		) : (
			<Card> </Card>
		);
	};

	const fetchGames = async (): Promise<Game[]> => {
		try {
			const params = {
				key: API_KEY,
				ordering: '-top_rating',
				page_size: '10',
				search: searchQuery,
			};
			const response = await axios.get(`${GAMES_API_URL}`, { params });
			return response.data.results;
		} catch (error) {
			console.log('thrown error');
			throw error;
		}
	};

	const onSearchHandler = async () => {
		setIsLoading(true);
		const updatedGameData = await fetchGames();
		setGameState(updatedGameData);
		setIsLoading(false);
	};

	function handleQueryUpdate(searchQuery: string) {
		setSearchQuery(searchQuery);
	}

	useEffect(() => {
		fetchGames().then((data) => {
			setGameState(data);
			setIsLoading(false);
		});
	}, []);

	return (
		<View style={styles.rootContainer}>
			<LinearGradient
				style={styles.linearGradient}
				colors={['black', 'white', 'black']}>
				<SearchInput
					onSearchHandler={onSearchHandler}
					onChangeText={handleQueryUpdate}
					placeholderTextColor={'black'}
					backgroundColor='white'
					buttonColor='white'
				/>
				<View style={styles.listContainer}>
					{isLoading ? (
						<ActivityIndicatorComponent size={'large'} color='blue' />
					) : (
						<>
							<FlashList
								data={gameState}
								renderItem={renderCards}
								estimatedItemSize={181}
								contentContainerStyle={{ padding: 5 }}
							/>
						</>
					)}
				</View>
			</LinearGradient>
		</View>
	);
};

export default GamessScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	linearGradient: {
		flex: 1,
	},
	listContainer: {
		flex: 7,
	},
	titleContainer: {
		flex: 1,
		flexDirection: 'row',
		margin: 10,
	},
	title: {
		flex: 4,
		fontSize: 20,
		fontWeight: 'bold',
		marginVertical: 10,
		color: 'black',
	},
	imageContainer: {
		flex: 1,
		borderRadius: 20,
		overflow: 'hidden',
	},
	image: {
		flex: 1,
		width: '100%',
		aspectRatio: 1,
		overflow: 'hidden',
	},
	pressed: {
		opacity: 0.5,
	},
	pressableContent: {
		flex: 1,
		borderWidth: 0.2,
		borderRadius: 20,
		padding: 4,
		justifyContent: 'center',
		alignItems: 'center',
	},
	wishlistText: {
		opacity: 0.8,
		padding: 2,
		fontWeight: 'bold',
		color: 'white',
	},
});
