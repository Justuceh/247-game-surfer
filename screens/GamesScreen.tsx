import { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ImageBackground, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { API_KEY, GAMES_API_URL } from '@env';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

import Card from '../components/Card';
import SearchInput from '../components/SearchInput';
import ActivityIndicatorComponent from '../components/ActivityIndicator';

const GamessScreen = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [gameState, setGameState] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const renderCards = ({ item }: { item: any }) => {
		return (
			<Card color='#0a1112'>
				<View style={styles.innerCardContainer}>
					<ImageBackground
						source={{ uri: item.background_image }}
						style={styles.image}
					/>
					<Text style={styles.title}>{item.name}</Text>
					<Text style={styles.text}>Released: {item.released}</Text>
					<Text style={styles.text}>Rating: {item.rating}</Text>
					<Text style={styles.text}>Top rating: {item.rating_top}</Text>
					<Text style={styles.text}>TBA: {item.tba ? 'Yes' : 'No'}</Text>
				</View>
			</Card>
		);
	};
	const fetchGames = async () => {
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
		flex: 9,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginVertical: 10,
		color: 'white',
	},
	text: {
		fontSize: 16,
		marginVertical: 2,
		color: 'white',
	},
	image: {
		flex: 1,
		width: '100%',
	},
	innerCardContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
});
