import { CHEAPSHARK_API_URL } from '@env';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
	View,
	StyleSheet,
	Text,
	Image,
	FlatList,
	Pressable,
} from 'react-native';
import { RootNavigatorParamList } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { useContext, useLayoutEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { CHEAPSHARK_REDIRECT_API } from '@env';

import ActivityIndicatorComponent from '../components/ActivityIndicator';
import Card from '../components/Card';
import { WishlistContext } from '../store/context/wishlist/wishlist-context';
import Icon from 'react-native-vector-icons/AntDesign';

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
	const wishlistContext = useContext(WishlistContext);

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
		const result = await WebBrowser.openBrowserAsync(
			`${CHEAPSHARK_REDIRECT_API}${dealID}`
		);
	};

	async function handleGameDealPress(dealID: string, storeID: string) {
		await openBrowserAsync(dealID);
	}
	const renderItem = ({ item }: { item: GameDealItem }) => {
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

		return (
			<Card color='#120c0c'>
				<View style={styles.rootContainer}>
					<Pressable
						onPress={() => handleGameDealPress(item.dealID, item.storeID)}
						style={({ pressed }) =>
							pressed
								? [styles.pressed, styles.pressableContainer]
								: styles.pressableContainer
						}>
						<View style={styles.imageContainer}>
							<Image style={styles.image} source={{ uri: item.thumb }} />
						</View>

						<View style={styles.descriptionContainer}>
							<Text style={styles.title}>{item.title}</Text>
							<View style={styles.saleInfoContainer}>
								<Text style={[styles.strikethroughText, styles.saleText]}>
									{item.normalPrice}
								</Text>
								<Text style={styles.saleText}>{item.salePrice}</Text>
								<Pressable
									onPress={changeWishlistStatusHandler}
									style={({ pressed }) => [pressed ? styles.pressed : null]}>
									<View style={styles.iconContainer}>
										<Icon
											onPress={changeWishlistStatusHandler}
											name={'star'}
											size={30}
											color={!isWishlisted ? 'white' : 'yellow'}
											style={styles.icon}
										/>
									</View>
								</Pressable>
							</View>
						</View>
					</Pressable>
				</View>
			</Card>
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
	pressableContainer: {
		flex: 1,
	},
	pressed: {
		opacity: 0.5,
	},
	imageContainer: {
		flex: 1,
		alignItems: 'center',
	},
	image: {
		flex: 1,
		aspectRatio: 2,
	},
	descriptionContainer: {
		flex: 1,
	},
	title: {
		flex: 1,
		flexWrap: 'wrap',
		textAlign: 'center',
		fontWeight: 'bold',
		color: 'white',
		fontSize: 18,
		padding: 4,
		margin: 4,
	},
	saleInfoContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	saleText: {
		flex: 1,
		padding: 4,
		textAlign: 'center',
		fontWeight: '400',
		justifyContent: 'center',
		color: 'white',
	},
	strikethroughText: {
		flex: 1,
		textDecorationLine: 'line-through',
		justifyContent: 'center',
		color: 'white',
	},
	iconContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	icon: {
		flex: 1,
		justifyContent: 'center',
	},
});
