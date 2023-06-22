import { CHEAPSHARK_API_URL } from '@env';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { View, StyleSheet, FlatList } from 'react-native';
import { RootNavigatorParamList } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { useContext, useLayoutEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { CHEAPSHARK_REDIRECT_API } from '@env';

import ActivityIndicatorComponent from '../components/ActivityIndicator';
import { WishlistContext } from '../store/context/wishlist/wishlist-context';
import GameDealCard from '../components/GameDealCard';

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
type GameDealsScreenNavigationProp = StackNavigationProp<
	RootNavigatorParamList,
	'GameDealsScreen'
>;

type GameDealsScreenProps = {
	route: GameDealsScreenRouteProp;
};

const GameDealsScreen = ({ route }: GameDealsScreenProps) => {
	const navigation = useNavigation<GameDealsScreenNavigationProp>();
	const { storeID, title: storeTitle } = route.params;

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

	const openBrowserAsync = async (dealID: string) => {
		await WebBrowser.openBrowserAsync(`${CHEAPSHARK_REDIRECT_API}${dealID}`);
	};

	const renderItem = ({ item }: { item: GameDealItem }) => {
		return (
			<GameDealCard
				gameDealItem={item}
				handleGameDealPress={openBrowserAsync}
			/>
		);
	};

	useLayoutEffect(() => {
		refetch;
		navigation.setOptions({
			title: `${storeTitle} Deals`,
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
		elevation: 4,
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.5,
	},
});
