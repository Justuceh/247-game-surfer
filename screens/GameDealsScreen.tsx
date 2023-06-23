import { useLayoutEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CHEAPSHARK_API_URL } from '@env';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RootNavigatorParamList } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { CHEAPSHARK_REDIRECT_API } from '@env';

import ActivityIndicatorComponent from '../components/ActivityIndicator';
import GameDealCard from '../components/GameDealCard';
import GameDealCategoryList from '../components/GameDealCategoryList';

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
	const [filteredaAAGames, setfilteredaAAGames] = useState<
		GameDealItem[] | undefined
	>([]);
	const cacheTime = {
		cacheTime: 1000 * 60 * 60, // Cache the store list for one hour before fetching again
	};

	async function fetchGameStoreDeals(filterParams: any) {
		const globalParams = {
			storeID: storeID,
			pageSize: 40,
			onSale: 1,
		};
		const params = { ...globalParams, ...filterParams };
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

	function filterOutExistingDeals(
		gamesToFiler: GameDealItem[] | undefined,
		existingGames: GameDealItem[] | undefined
	) {
		return gamesToFiler?.filter(
			(deal) =>
				!existingGames
					?.map((existingDeal) => existingDeal.dealID)
					.includes(deal.dealID)
		);
	}

	const {
		data: topDeals,
		isLoading: topDealsIsLoading,
		refetch: refetchTopDeals,
	} = useQuery<GameDealItem[], unknown>(
		[`topDeals-${storeID}`],
		() => fetchGameStoreDeals({ upperPrice: 15 }),
		cacheTime
	);

	const {
		data: AAADeals,
		isLoading: aAADealsIsLoading,
		refetch: refetchaAADeals,
	} = useQuery<GameDealItem[], unknown>(
		[`aAADeals-${storeID}`],
		() => fetchGameStoreDeals({ AAA: 1 }),
		cacheTime
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
		refetchTopDeals;
		refetchaAADeals;
		setfilteredaAAGames(filterOutExistingDeals(AAADeals, topDeals));
		navigation.setOptions({
			title: `${storeTitle} Deals`,
			headerStyle: { backgroundColor: 'black' },
			headerTintColor: 'white',
		});
	}, [navigation, route, topDeals, AAADeals]);

	return (
		<>
			<LinearGradient
				style={styles.linearGradient}
				colors={['#313131', '#dfdfdf', '#1c1b1b']}>
				<ScrollView style={styles.scrollContainer}>
					<View style={styles.listItemContainer}>
						{topDealsIsLoading || aAADealsIsLoading ? (
							<ActivityIndicatorComponent size='large' color='black' />
						) : (
							<>
								<GameDealCategoryList
									data={topDeals}
									categoryText='Top Deals'
									renderItem={renderItem}
								/>
								<GameDealCategoryList
									data={filteredaAAGames}
									categoryText='Retail > $30'
									renderItem={renderItem}
								/>
								{/* Add more category lists here */}
							</>
						)}
					</View>
				</ScrollView>
			</LinearGradient>
		</>
	);
};

export default GameDealsScreen;

const styles = StyleSheet.create({
	linearGradient: {
		flex: 1,
	},
	scrollContainer: {
		flex: 1,
	},
	listItemContainer: {
		flex: 1,
		elevation: 4,
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.5,
	},
});
