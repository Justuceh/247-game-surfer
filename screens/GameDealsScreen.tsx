import { useLayoutEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CHEAPSHARK_API_URL } from '@env';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RootNavigatorParamList } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';

import GameDealItem from '../models/GameDealItem';
import ActivityIndicatorComponent from '../components/ActivityIndicator';
import GameDealCard from '../components/GameDealCard';
import GameDealCategoryList from '../components/GameDealCategoryList';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import GameDetails from '../components/GameDetails';
import ButtonList from '../components/ButtonList';
import filterLabels from '../constants/string';

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
	const [showGameDetails, setShowGameDetails] = useState(false);
	const [modalDealItem, setModalDealItem] = useState<GameDealItem>();
	const navigation = useNavigation<GameDealsScreenNavigationProp>();
	const [activeDataSet, setActiveDataSet] = useState<
		GameDealItem[] | undefined
	>([]);
	const { storeID, title: storeTitle } = route.params;
	const cacheTime = {
		cacheTime: 1000 * 60 * 60, // Cache the store list for one hour before fetching again
	};

	function closeGameDetailsModal() {
		setShowGameDetails(false);
		setModalDealItem(undefined);
	}
	function openGameDetailsModal(dealItem: GameDealItem) {
		setShowGameDetails(true);
		setModalDealItem(dealItem);
	}

	async function fetchGameStoreDeals(filterParams: any) {
		const globalParams = {
			storeID: storeID,
			pageNumber: 1,
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

	const {
		data: topDeals,
		isLoading: topDealsIsLoading,
		refetch: refetchTopDeals,
	} = useQuery<GameDealItem[], unknown>(
		[`topDeals-${storeID}`],
		() => fetchGameStoreDeals({ onSale: 1, upperPrice: 15 }),
		cacheTime
	);

	const {
		data: highlyRatedBySteam,
		isLoading: highlyRatedBySteamIsLoading,
		refetch: refetchHighlyRatedBySteam,
	} = useQuery<GameDealItem[], unknown>(
		[`highlyRatedBySteam-${storeID}`],
		() => fetchGameStoreDeals({ steamRating: 80 }),
		cacheTime
	);

	const {
		data: highlyRatedByMetacritic,
		isLoading: highlyRatedByMetacriticIsLoading,
		refetch: refetchhighlyRatedByMetacritic,
	} = useQuery<GameDealItem[], unknown>(
		[`highlyRatedByMetacritic-${storeID}`],
		() => fetchGameStoreDeals({ metacritic: 70 }),
		cacheTime
	);

	const {
		data: under20DollarDeals,
		isLoading: under20DollarDealsIsLoading,
		refetch: refetchUnder20DollarDeals,
	} = useQuery<GameDealItem[], unknown>(
		[`under20DollarDeals-${storeID}`],
		() => fetchGameStoreDeals({ upperPrice: 20, lowerPrice: 15 }),
		cacheTime
	);

	const {
		data: fiveToTenDollarDeals,
		isLoading: fiveToTenDollarDealsIsLoading,
		refetch: refetchFiveToTenDollarDeals,
	} = useQuery<GameDealItem[], unknown>(
		[`fiveToTenDollarDeals-${storeID}`],
		() => fetchGameStoreDeals({ upperPrice: 10, lowerPrice: 5 }),
		cacheTime
	);

	const renderItem = ({ item }: { item: GameDealItem }) => {
		return (
			<GameDealCard
				gameDealItem={item}
				handleGameDealPress={openGameDetailsModal}
			/>
		);
	};

	useLayoutEffect(() => {
		refetchTopDeals();
		refetchHighlyRatedBySteam();
		refetchhighlyRatedByMetacritic();
		refetchUnder20DollarDeals();
		refetchFiveToTenDollarDeals();
		navigation.setOptions({
			title: `${storeTitle} Deals`,
			headerStyle: { backgroundColor: 'black' },
			headerTitleStyle: { fontFamily: Fonts.openSans_400Regular, fontSize: 20 },
			headerTintColor: Colors.offWhite,
		});
	}, [
		navigation,
		route,
		topDeals,
		highlyRatedBySteam,
		highlyRatedByMetacritic,
		under20DollarDeals,
		fiveToTenDollarDeals,
	]);
	const buttonLabels = Object.values(filterLabels);

	function handleButtonPress(label: string) {
		const dataSets = Object.entries(filterLabels).filter(
			(key, value) => key[1] === label
		);
		switch (dataSets[0][0]) {
			case 'topDeals':
				setActiveDataSet(topDeals);
				break;
			case 'highlyRatedBySteam':
				setActiveDataSet(highlyRatedBySteam);
				break;
			case 'highlyRatedByMetacritic':
				setActiveDataSet(highlyRatedByMetacritic);
				break;
			case 'under20DollarDeals':
				setActiveDataSet(under20DollarDeals);
				break;
			case 'fiveToTenDollarDeals':
				setActiveDataSet(fiveToTenDollarDeals);
				break;
			default:
				setActiveDataSet(topDeals);
				break;
		}
	}
	return (
		<>
			<LinearGradient
				style={styles.linearGradient}
				colors={[
					Colors.linearGradient.topColor,
					Colors.linearGradient.middleColor,
					Colors.linearGradient.bottomColor,
				]}>
				{topDealsIsLoading ||
				highlyRatedBySteamIsLoading ||
				highlyRatedByMetacriticIsLoading ||
				under20DollarDealsIsLoading ||
				fiveToTenDollarDealsIsLoading ? (
					<View style={styles.activityIndicatorContainer}>
						<ActivityIndicatorComponent size='large' color='white' />
					</View>
				) : (
					<View style={styles.rootContainer}>
						<View style={styles.filterContainer}>
							<ButtonList onPress={handleButtonPress} labels={buttonLabels} />
						</View>
						<View style={styles.scrollContainer}>
							<View style={styles.listItemContainer}>
								<>
									{showGameDetails && (
										<GameDetails
											showDetails={showGameDetails}
											onClose={closeGameDetailsModal}
											gameDealItem={modalDealItem}
										/>
									)}
									{activeDataSet?.length ? (
										<GameDealCategoryList
											data={activeDataSet}
											renderItem={renderItem}
										/>
									) : (
										<GameDealCategoryList
											data={topDeals}
											renderItem={renderItem}
										/>
									)}
								</>
							</View>
						</View>
					</View>
				)}
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
		justifyContent: 'center',
	},
	filterContainer: {
		flex: 0.7,
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 7,
	},
	scrollContainer: {
		flex: 11,
	},
	activityIndicatorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	listItemContainer: {
		flex: 1,
		elevation: 4,
		shadowColor: '#c7c7c7',
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 4,
		shadowOpacity: 0.5,
	},
});
