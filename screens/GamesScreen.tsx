import { useEffect, useState } from 'react';
import {
	Text,
	View,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	Pressable,
} from 'react-native';
import { CHEAPSHARK_API_URL } from '@env';
import axios from 'axios';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';

import ActivityIndicatorComponent from '../components/ActivityIndicator';
import SearchInput from '../components/SearchInput';
import GameDealItem from '../models/GameDealItem';
import GameList from '../components/GameList';
import Colors from '../constants/colors';
import ButtonList from '../components/ButtonList';
import filterLabels from '../constants/string';
import Filters from '../models/Filters';
import Fonts from '../constants/fonts';

const GamesScreen = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [clearSearchValue, setClearSearchValue] = useState<
		boolean | undefined
	>();
	const [apiSearchQuery, setApiSearchQuery] = useState('');
	const [forceSelectTopDealLabel, setForceSelectTopDealLabel] = useState('');
	const [pageNumber, setPageNumber] = useState(0);
	const topDealFilterParams = {
		onSale: 1,
		upperPrice: 40,
		pageNumber: pageNumber,
	};
	const [filterParams, setFilterParams] =
		useState<Filters>(topDealFilterParams);

	async function fetchGames() {
		const params = { ...filterParams, pageNumber: pageNumber };
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
		fetchNextPage,
		isLoading,
		isFetchingNextPage,
		isError,
		hasNextPage,
	} = useInfiniteQuery<GameDealItem[], unknown>(['games'], fetchGames, {
		getNextPageParam: (lastPage, pages) => {
			return pageNumber + 1;
		},
	});

	const onSearchHandler = () => {
		setApiSearchQuery(searchQuery);
		setFilterParams({ title: searchQuery });
	};

	const onClearHandler = () => {
		setApiSearchQuery('');
		setFilterParams(topDealFilterParams);
		setForceSelectTopDealLabel(filterLabels.topDeals);
	};

	function handleQueryUpdate(searchQuery: string) {
		setSearchQuery(searchQuery);
	}
	useEffect(() => {
		if (searchQuery !== '' || apiSearchQuery !== '') {
			setClearSearchValue(filterParams !== null);
		}
	}, [filterParams]);

	useEffect(() => {
		if (forceSelectTopDealLabel !== '') setForceSelectTopDealLabel('');
	}, [forceSelectTopDealLabel]);

	function handleFilterButtonPress(label: string) {
		setClearSearchValue(false);
		const dataSets = Object.entries(filterLabels).filter(
			(key, value) => key[1] === label
		);

		let param = { pageNumber: 0 };
		setPageNumber(0);
		switch (dataSets[0][0]) {
			case 'topDeals':
				param = { ...param, ...topDealFilterParams };
				break;
			case 'highlyRatedBySteam':
				param = { ...param, ...{ steamRating: 80 } };
				break;
			case 'highlyRatedByMetacritic':
				param = { ...param, ...{ metacritic: 70 } };
				break;
			case 'under20DollarDeals':
				param = { ...param, ...{ upperPrice: 20, lowerPrice: 15 } };
				break;
			case 'fiveToTenDollarDeals':
				param = { ...param, ...{ upperPrice: 10, lowerPrice: 5 } };
				break;
			default:
				param = { ...param, ...topDealFilterParams };
				break;
		}
		setFilterParams(param);
	}
	const buttonLabels = Object.values(filterLabels);

	const getFooterComponent = () => {
		return (
			<Pressable
				onPress={loadMoreGames}
				style={({ pressed }) => {
					return pressed
						? [styles.searchButton, styles.buttonPressed]
						: styles.searchButton;
				}}>
				<Text style={styles.searchText}>Get More Games!</Text>
			</Pressable>
		);
	};
	const loadMoreGames = () => {
		setPageNumber((prevPageNumber) => prevPageNumber + 1);
		fetchNextPage();
	};
	useEffect(() => {
		console.log(games?.pages);
	}, [games]);
	return (
		<KeyboardAvoidingView
			style={styles.keyboardAvoidingViewContainer}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
			<LinearGradient
				style={styles.linearGradient}
				colors={[
					Colors.linearGradient.topColor,
					Colors.linearGradient.middleColor,
					Colors.linearGradient.bottomColor,
				]}>
				<View style={styles.rootContainer}>
					<View style={styles.filterContainer}>
						<ButtonList
							onPress={handleFilterButtonPress}
							labels={buttonLabels}
							forceSelectLabel={forceSelectTopDealLabel}
						/>
					</View>
					<View style={styles.searchContainer}>
						<SearchInput
							onSearchHandler={onSearchHandler}
							onClearHandler={onClearHandler}
							onChangeText={handleQueryUpdate}
							placeholderTextColor={'grey'}
							backgroundColor='#fff'
							buttonColor='white'
							clearValue={clearSearchValue}
						/>
					</View>
					<View style={styles.gameListContainer}>
						{isLoading ? (
							<View style={styles.activityIndicatorContainer}>
								<ActivityIndicatorComponent color='white' size='large' />
							</View>
						) : isError ? (
							<View style={styles.displayMessagesContainer}>
								<Text style={styles.displayMessagesText}>
									Something went wrong
								</Text>
							</View>
						) : games.pages?.length ? (
							<GameList
								games={games.pages.flatMap((a) => a)}
								footerComponent={getFooterComponent}
							/>
						) : (
							<View style={styles.displayMessagesContainer}>
								<Text style={styles.displayMessagesText}>
									No Game Deals Available for {apiSearchQuery} :(
								</Text>
							</View>
						)}
					</View>
				</View>
			</LinearGradient>
		</KeyboardAvoidingView>
	);
};

export default GamesScreen;
const styles = StyleSheet.create({
	keyboardAvoidingViewContainer: {
		flex: 1,
	},
	linearGradient: {
		flex: 1,
	},
	rootContainer: {
		flex: 1,
	},
	filterContainer: {
		flex: 0.7,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.charcoalLight,
		paddingTop: 8,
	},
	searchContainer: {
		flex: 1,
		backgroundColor: Colors.charcoalLight,
	},
	gameListContainer: {
		flex: 11,
	},
	activityIndicatorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	displayMessagesContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 30,
	},
	displayMessagesText: {
		fontSize: 30,
		fontWeight: 'bold',
	},
	searchButton: {
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#ffffff',
		borderRadius: 15,
		opacity: 0.9,
		flex: 1,
		padding: 5,
		justifyContent: 'center',
	},
	searchText: {
		fontFamily: Fonts.openSans_400Regular,
		textAlign: 'center',
		fontSize: 15,
		fontWeight: '400',
	},
	buttonPressed: {
		opacity: 0.5,
	},
});
