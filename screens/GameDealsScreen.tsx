import { CHEAPSHARK_API_URL } from '@env';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { View, StyleSheet, Text, Image, FlatList } from 'react-native';
import { RootNavigatorParamList } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLayoutEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import ActivityIndicatorComponent from '../components/ActivityIndicator';
import Card from '../components/Card';

export interface GameDealItem {
	gameID: string;
	storeID: string;
	title: string;
	internalname: string;
	normalPrice: string;
	salePrice: 'string';
	thumb: string;
	isOnSale: '1' | '0';
	dealRating: string;
	dealID: string;
}
type GameDealsScreenRouteProp = RouteProp<
	RootNavigatorParamList,
	'GameDealsScreen'
>;
type GameDealsScreenScreenNavigationProp = StackNavigationProp<
	RootNavigatorParamList,
	'GameDealsScreen'
>;

type GameDealsScreenProps = {
	route: GameDealsScreenRouteProp;
};

const GameDealsScreen = ({ route }: GameDealsScreenProps) => {
	const navigation = useNavigation<GameDealsScreenScreenNavigationProp>();
	const { storeID, title } = route.params;
	async function fetchGameStoreDeals() {
		const params = {
			storeID: storeID,
			pageSize: 20,
			upperPrice: 15,
		};
		return await axios
			.get(`${CHEAPSHARK_API_URL}/deals`, { params })
			.then((response) => {
				if (!response) {
					throw new Error('Network response was not ok');
				}
				return response.data;
			})
			.catch((err) => err);
	}

	const {
		data: games,
		isLoading,
		error,
		refetch,
	} = useQuery<GameDealItem[], unknown>(
		[`gameDeals-${storeID}`],
		fetchGameStoreDeals,
		{
			cacheTime: 1000 * 60 * 60, // Cache the store list for one hour before fetching again
		}
	);

	const renderItem = ({ item }: { item: GameDealItem }) => {
		return (
			<Card color='#e4dddd'>
				<View style={styles.rootContainer}>
					<View style={styles.imageContainer}>
						<Image style={styles.image} source={{ uri: item.thumb }} />
					</View>

					<View style={styles.descriptionContainer}>
						<Text style={styles.title}>{item.title}</Text>
						<View style={styles.saleInfoContainer}>
							<Text style={[styles.strikethroughText, styles.saleText]}>
								{item.normalPrice}
							</Text>
							<Text style={styles.saleText}>{item.salePrice}</Text>
						</View>
					</View>
				</View>
			</Card>
		);
	};

	useLayoutEffect(() => {
		refetch;
		navigation.setOptions({
			title: title,
			headerStyle: { backgroundColor: 'black' },
			headerTintColor: 'white',
		});
	}, [navigation, route]);

	return (
		<>
			<LinearGradient
				style={styles.linearGradient}
				colors={['#313131', '#dfdfdf', '#313131']}>
				<View style={styles.rootContainer}>
					{isLoading ? (
						<ActivityIndicatorComponent size='large' color='black' />
					) : (
						<View>
							<FlatList
								data={games}
								keyExtractor={(item) => item.dealID}
								numColumns={2}
								renderItem={renderItem}
							/>
						</View>
					)}
				</View>
			</LinearGradient>
		</>
	);
};

export default GameDealsScreen;

const styles = StyleSheet.create({
	linearGradient: {
		flex: 1,
	},
	rootContainer: {
		flex: 1,
	},
	imageContainer: {
		flex: 1,
		alignItems: 'center',
	},
	image: {
		flex: 1,
		aspectRatio: 2,
	},
	descriptionContainer: {
		flex: 1,
	},
	title: {
		textAlign: 'center',
		fontWeight: 'bold',
		color: 'black',
		fontSize: 18,
		padding: 4,
		margin: 4,
	},
	saleInfoContainer: {
		flexDirection: 'row',
	},
	saleText: {
		flex: 1,
		padding: 4,
		textAlign: 'center',
		fontWeight: '400',
	},
	strikethroughText: {
		textDecorationLine: 'line-through',
	},
});
