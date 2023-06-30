import { useState } from 'react';
import {
	Text,
	View,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { CHEAPSHARK_API_URL } from '@env';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';

import ActivityIndicatorComponent from '../components/ActivityIndicator';
import SearchInput from '../components/SearchInput';
import { GameDealItem } from './GameDealsScreen';
import GameList from '../components/GameList';
import Colors from '../constants/colors';

const GamesScreen = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [apiSearchQuery, setApiSearchQuery] = useState('');

	async function fetchGames() {
		const params = {
			pageSize: 20,
			title: apiSearchQuery,
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
		error: dataError,
	} = useQuery<GameDealItem[], unknown>([`games`, apiSearchQuery], fetchGames);

	const onSearchHandler = () => {
		setApiSearchQuery(searchQuery);
	};

	const onClearHandler = () => {
		setSearchQuery('');
		setApiSearchQuery('');
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
					colors={[
						Colors.linearGradient.topColor,
						Colors.linearGradient.middleColor,
						Colors.linearGradient.bottomColor,
					]}>
					{isLoading ? (
						<View style={styles.activityIndicatorContainer}>
							<ActivityIndicatorComponent color='black' size='large' />
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
				</LinearGradient>
			</View>
		</KeyboardAvoidingView>
	);
};

export default GamesScreen;
const styles = StyleSheet.create({
	keyboardAvoidingViewContainer: {
		flex: 1,
	},
	rootContainer: {
		flex: 1,
	},
	searchContainer: {
		flex: 1,
		backgroundColor: Colors.charcoalDark,
	},
	linearGradient: {
		flex: 13,
		alignItems: 'center',
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
