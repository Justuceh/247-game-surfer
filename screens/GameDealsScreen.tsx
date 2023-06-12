import { CHEAPSHARK_API_URL } from '@env';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { View, StyleSheet, Text } from 'react-native';

export interface GameDealsProps {
	storeID: string;
}

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

const GameDealsScreen = ({ storeID }: GameDealsProps) => {
	async function fetchGameStoreDeals() {
		const params = {
			storeID: storeID,
			pageSize: 20,
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
	} = useQuery<GameDealItem[], unknown>(['gameDeals'], fetchGameStoreDeals);
	const filteredGames = games?.filter((game) => game.dealID !== undefined);

	return <View></View>;
};

export default GameDealsScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
	},
});
