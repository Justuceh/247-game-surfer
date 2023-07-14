import { useEffect, useState } from 'react';
import {
	Text,
	View,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { CHEAPSHARK_API_URL } from '@env';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';

import ActivityIndicatorComponent from '../components/ActivityIndicator';
import SearchInput from '../components/SearchInput';
import GameDealItem from '../models/GameDealItem';
import GameList from '../components/GameList';
import Colors from '../constants/colors';
import ButtonList from '../components/ButtonList';
import filterLabels from '../constants/string';

type Filters = {
	[key: string]: number;
};

const GamesScreen = () => {
	const topDealFilterParams = { onSale: 1, upperPrice: 40 };
	const [searchQuery, setSearchQuery] = useState('');
	const [clearSearchValue, setClearSearchValue] = useState<
		boolean | undefined
	>();
	const [apiSearchQuery, setApiSearchQuery] = useState('');
	const [forceSelectTopDealLabel, setForceSelectTopDealLabel] = useState('');
	const [filterParams, setFilterParams] = useState<Filters | null>(null);

	async function fetchGames() {
		const params = !filterParams
			? {
					title: apiSearchQuery,
			  }
			: { pageNumber: 2, ...filterParams };
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
		error: dataError,
	} = useQuery<GameDealItem[], unknown>(
		[`games`, apiSearchQuery, filterParams],
		fetchGames
	);

	const onSearchHandler = () => {
		setApiSearchQuery(searchQuery);
		setFilterParams(null);
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
		setFilterParams(topDealFilterParams);
	}, []);
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
		let param = {};
		switch (dataSets[0][0]) {
			case 'topDeals':
				param = topDealFilterParams;
				break;
			case 'highlyRatedBySteam':
				param = { steamRating: 80 };
				break;
			case 'highlyRatedByMetacritic':
				param = { metacritic: 70 };
				break;
			case 'under20DollarDeals':
				param = { upperPrice: 20, lowerPrice: 15 };
				break;
			case 'fiveToTenDollarDeals':
				param = { upperPrice: 10, lowerPrice: 5 };
				break;
			default:
				param = {};
				break;
		}
		setFilterParams(param);
	}
	const buttonLabels = Object.values(filterLabels);
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
						) : dataError ? (
							<View style={styles.displayMessagesContainer}>
								<Text style={styles.displayMessagesText}>
									Something went wrong
								</Text>
							</View>
						) : games?.length ? (
							<GameList games={games} />
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
});
