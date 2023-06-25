import { useState } from 'react';
import {
	View,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	Dimensions,
} from 'react-native';
import { CHEAPSHARK_API_URL, CHEAPSHARK_REDIRECT_API } from '@env';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { useQuery } from '@tanstack/react-query';

import ActivityIndicatorComponent from '../components/ActivityIndicator';
import SearchInput from '../components/SearchInput';
import { GameDealItem } from './GameDealsScreen';
import GameDealCard from '../components/GameDealCard';
import GameList from '../components/GameList';

const GamesScreen = () => {
	const [searchQuery, setSearchQuery] = useState('');

	async function fetchGames() {
		const params = {
			pageSize: 20,
			title: searchQuery,
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
	} = useQuery<GameDealItem[], unknown>([`games`], fetchGames);

	const openBrowserAsync = async (dealID: string) => {
		await WebBrowser.openBrowserAsync(`${CHEAPSHARK_REDIRECT_API}${dealID}`);
	};

	const onSearchHandler = async () => {
		await refetch();
	};
	const onClearHandler = async () => {
		setSearchQuery('');
		await refetch();
	};

	function handleQueryUpdate(searchQuery: string) {
		setSearchQuery(searchQuery);
	}

	return (
		<KeyboardAvoidingView
			style={styles.keyboardAvoidingViewContainer}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
			<View style={styles.rootContainer}>
				<View style={styles.searchContainer}>
					<SearchInput
						onSearchHandler={onSearchHandler}
						onClearHandler={onClearHandler}
						onChangeText={handleQueryUpdate}
						placeholderTextColor={'black'}
						backgroundColor='#fff'
						buttonColor='white'
					/>
				</View>
				<LinearGradient
					style={styles.linearGradient}
					colors={['#313131', '#dfdfdf', '#313131']}>
					{isLoading ? (
						<ActivityIndicatorComponent color='black' size='large' />
					) : (
						<GameList games={games} />
					)}
				</LinearGradient>
			</View>
		</KeyboardAvoidingView>
	);
};

export default GamesScreen;
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
	keyboardAvoidingViewContainer: {
		flex: 1,
	},
	rootContainer: {
		flex: 1,
	},
	searchContainer: {
		flex: 1,
	},
	linearGradient: {
		flex: 13,
		alignItems: 'center',
	},
});
