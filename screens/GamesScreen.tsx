import { useState, useEffect, useContext } from 'react';
import {
	View,
	StyleSheet,
	ImageBackground,
	Text,
	Pressable,
	KeyboardAvoidingView,
	FlatList,
	Platform,
} from 'react-native';
import { CHEAPSHARK_API_URL } from '@env';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';

import Card from '../components/Card';
import SearchInput from '../components/SearchInput';
import ActivityIndicatorComponent from '../components/ActivityIndicator';
import { WishlistContext } from '../store/context/wishlist/wishlist-context';
import { useQuery } from '@tanstack/react-query';

import { GameDealItem } from './GameDealsScreen';

const GamesScreen = () => {
	const [searchQuery, setSearchQuery] = useState('');

	const wishlistContext = useContext(WishlistContext);

	function handleOnGamePress() {}

	async function fetchGames() {
		const params = {
			pageSize: 20,
			upperPrice: 15,
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

	const renderCards = ({ item }: { item: GameDealItem }) => {
		const isWishlisted = wishlistContext.games.some(
			(game) => game.gameID === item.gameID
		);

		const changeWishlistStatusHandler = () => {
			if (isWishlisted) {
				wishlistContext.removeGame(item.gameID);
			} else {
				wishlistContext.addGame(item);
			}
		};
		return item ? (
			<>
				<View style={styles.listItemContainer}>
					<Pressable
						onPress={handleOnGamePress}
						style={({ pressed }) => [pressed ? styles.pressed : null]}>
						<View style={styles.imageContainer}>
							<ImageBackground
								source={{ uri: item.thumb }}
								style={styles.image}
							/>
						</View>
					</Pressable>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>{item.title}</Text>
						<Pressable
							onPress={changeWishlistStatusHandler}
							style={({ pressed }) => [pressed ? styles.pressed : null]}>
							<View style={styles.pressableContent}>
								{!isWishlisted ? (
									<Icon
										onPress={changeWishlistStatusHandler}
										name={'star'}
										size={30}
										color='white'
									/>
								) : (
									<Icon
										onPress={changeWishlistStatusHandler}
										name={'star'}
										size={30}
										color='yellow'
									/>
								)}
							</View>
						</Pressable>
					</View>
				</View>
			</>
		) : (
			<Card> </Card>
		);
	};

	const onSearchHandler = async () => {
		await refetch();
	};

	function handleQueryUpdate(searchQuery: string) {
		setSearchQuery(searchQuery);
	}

	return (
		<KeyboardAvoidingView
			style={styles.rootContainer}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
			<View style={styles.rootContainer}>
				<View style={styles.searchContainer}>
					<SearchInput
						onSearchHandler={onSearchHandler}
						onChangeText={handleQueryUpdate}
						placeholderTextColor={'black'}
						backgroundColor='#fff'
						buttonColor='white'
					/>
				</View>
				<View style={styles.linearGradient}>
					<LinearGradient
						style={styles.linearGradient}
						colors={['#313131', '#dfdfdf', '#313131']}>
						<View style={styles.listContainer}>
							{isLoading ? (
								<ActivityIndicatorComponent size={'large'} color='blue' />
							) : (
								<>
									<FlatList
										data={games}
										renderItem={renderCards}
										contentContainerStyle={{ padding: 5 }}
										keyExtractor={(item) => `${item.dealID}`}
									/>
								</>
							)}
						</View>
					</LinearGradient>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

export default GamesScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	searchContainer: {
		flex: 1,
	},
	linearGradient: {
		flex: 13,
	},
	listContainer: {
		flex: 7,
	},
	listItemContainer: {
		elevation: 4,
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.5,
	},
	titleContainer: {
		flex: 1,
		flexDirection: 'row',
		margin: 10,
	},
	title: {
		flex: 4,
		fontSize: 20,
		fontWeight: 'bold',
		marginVertical: 10,
		color: 'black',
	},
	imageContainer: {
		flex: 1,
		borderRadius: 20,
		overflow: 'hidden',
	},
	image: {
		flex: 1,
		width: '100%',
		aspectRatio: 1,
		overflow: 'hidden',
	},
	pressed: {
		opacity: 0.5,
	},
	pressableContent: {
		flex: 1,
		padding: 4,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
