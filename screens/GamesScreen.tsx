import { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ImageBackground, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { API_KEY, API_URL } from '@env';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import Card from '../components/Card';
import SearchInput from '../components/SearchInput';

interface GameDetail {
	id: number;
	slug: string;
	name: string;
	released: string;
	tba: boolean;
	background_image: string;
	rating: number;
	rating_top: number;
	ratings: any;
}

const fetchGames = async () => {
	const params = {
		key: API_KEY,
		ordering: '-rating',
		page_size: '10',
		search: 'Diablo',
	};
	const response = await axios.get(`${API_URL}`, { params });
	return response.data.results;
};

const GamessScreen = () => {
	const { data: games, isLoading, isError } = useQuery(['games'], fetchGames);

	if (isLoading) {
		return <Text>Loading...</Text>;
	}

	if (isError) {
		return <Text>An error occurred...</Text>;
	}

	const renderCards = ({ item }: { item: any }) => {
		return (
			<Card>
				<View>
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

	function onSearchHandler(searchQuery: string) {
		console.log(games);
	}

	return (
		<View style={styles.rootContainer}>
			<SearchInput onSearchHandler={onSearchHandler} />
			<View style={styles.listContainer}>
				<FlashList
					data={games}
					renderItem={renderCards}
					estimatedItemSize={181}
					contentContainerStyle={{ padding: 5 }}
				/>
			</View>
		</View>
	);
};

export default GamessScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	searchContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: '10%',
		margin: 5,
	},
	searchInput: {
		flex: 3,
		borderWidth: 1,
		borderColor: '#837f7e',
		borderRadius: 89,
		marginRight: 10,
		padding: 5,

		opacity: 0.7,
		justifyContent: 'center',
	},
	searchButton: {
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#837f7e',
		borderRadius: 10,
		opacity: 0.7,
		flex: 1,
		padding: 5,
		justifyContent: 'center',
	},
	searchText: {
		textAlign: 'center',
		fontSize: 12,
		fontWeight: '400',
	},
	listContainer: {
		flex: 9,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginVertical: 10,
	},
	text: {
		fontSize: 16,
		marginVertical: 2,
	},
	image: {
		flex: 1,
	},
});
