import { CHEAPSHARK_API_URL } from '@env';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { View, StyleSheet, Text } from 'react-native';
import { RootNavigatorParamList } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useLayoutEffect } from 'react';

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
			pageSize: 2,
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
	useLayoutEffect(() => {
		navigation.setOptions({ title: title });
	}, [navigation, route]);

	const {
		data: games,
		isLoading,
		error,
		refetch,
	} = useQuery<GameDealItem[], unknown>(['gameDeals'], fetchGameStoreDeals);
	const filteredGames = games?.filter((game) => game.dealID !== undefined);

	useEffect(() => {
		refetch;
	}, [navigation, route]);
	console.log(games);
	return (
		<View>
			{games?.map((game) => {
				return (
					<View key={game.dealID}>
						<Text>{game.title}</Text>
						<Text>{game.salePrice}</Text>
					</View>
				);
			})}
		</View>
	);
};

export default GameDealsScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
	},
});
