import { useContext, useEffect, useRef, useState } from 'react';
import {
	View,
	StyleSheet,
	ImageBackground,
	Pressable,
	FlatList,
	Image,
	Text,
	Animated,
	LayoutAnimation,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { CHEAPSHARK_BASE_URL, CHEAPSHARK_API_URL } from '@env';
import axios from 'axios';

import Card from '../components/Card';
import ActivityIndicatorComponent from '../components/ActivityIndicator';
import { GameStoreContext } from '../store/context/game_deals/game-stores-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from '../App';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

export interface GameStoreInterface {
	storeID: string;
	storeName: string;
	images: {
		banner: string;
		logo: string;
		icon: string;
	};
	isActive: boolean;
}

async function fetchGameStores(): Promise<GameStoreInterface[]> {
	try {
		const response = await axios.get(`${CHEAPSHARK_API_URL}/stores`);
		return response.data;
	} catch (error) {
		console.log('thrown error');
		throw error;
	}
}
type StoresScreenNavigationProp = StackNavigationProp<
	RootNavigatorParamList,
	'GameDealsScreen'
>;

const StoresScreen = () => {
	const [bannerText, setBannerText] = useState('Select a store to surf deals');
	const [bannerVisible, setBannerVisible] = useState(true);
	const navigation = useNavigation<StoresScreenNavigationProp>();
	const {
		data: gameStores,
		isLoading,
		error,
	} = useQuery<GameStoreInterface[], unknown>(['gameStores'], fetchGameStores, {
		cacheTime: 1000 * 60 * 60 * 24, // Cache the store list for one day before fetching again
	});

	const storesContext = useContext(GameStoreContext);

	useEffect(() => {
		if (
			gameStores &&
			gameStores.length > 0 &&
			storesContext.stores.length === 0
		) {
			storesContext.addGameStores(gameStores);
		}
	}, [gameStores, storesContext.stores]);

	const filteredGames = storesContext.stores.filter((store) => store.isActive);

	const handleGameStorePress = (storeID: string, storeName: string) => {
		navigation.navigate('GameDealsScreen', {
			storeID: storeID,
			title: storeName,
		});
		if (bannerText !== 'Surf Deals by Store') {
			setTimeout(() => {
				setBannerText('Surf Deals by Store');
			}, 500);
		}
	};

	const renderCards = ({ item }: { item: GameStoreInterface }) => {
		return (
			<Card
				style={{
					aspectRatio: 1,
				}}>
				<Pressable
					onPress={() => handleGameStorePress(item.storeID, item.storeName)}
					style={({ pressed }) => [pressed ? styles.pressed : null]}>
					<ImageBackground
						style={styles.cardImage}
						source={{ uri: `${CHEAPSHARK_BASE_URL}${item.images.logo}` }}
					/>
				</Pressable>
			</Card>
		);
	};
	const bannerOpacity = useRef(new Animated.Value(1)).current;
	useEffect(() => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	}, [bannerVisible]);

	useEffect(() => {
		Animated.timing(bannerOpacity, {
			toValue: bannerVisible ? 1 : 0,
			duration: 300, // Adjust the animation duration as needed
			useNativeDriver: true,
		}).start();
	}, [bannerVisible]);
	const flatListRef = useRef<FlatList<GameStoreInterface>>(null);
	const scrollThreshold = 100; // Adjust the scroll threshold as needed

	const handleScroll = (event: any) => {
		const offsetY = event.nativeEvent.contentOffset.y;
		if (offsetY >= scrollThreshold && bannerVisible) {
			setBannerVisible(false);
		} else if (offsetY < scrollThreshold && !bannerVisible) {
			setBannerVisible(true);
		}
	};

	return (
		<>
			<LinearGradient
				style={styles.linearGradient}
				colors={[
					Colors.linearGradient.topColor,
					Colors.linearGradient.middleColor,
					Colors.linearGradient.bottomColor,
				]}>
				<View style={styles.rootContainer}>
					{isLoading ? (
						<ActivityIndicatorComponent size='large' color='white' />
					) : (
						<>
							{bannerVisible && (
								<Animated.View
									style={[styles.bannerContainer, { opacity: bannerOpacity }]}>
									<View style={styles.bannerContainer}>
										<View style={styles.bannerTextContainer}>
											<Text style={styles.bannerText}>{bannerText}</Text>
										</View>
										<View style={styles.bannerImageContainer}>
											<Image
												source={require('../assets/247-gs-high-resolution-color-icon.png')}
												style={styles.bannerImage}
												resizeMode='contain'
											/>
										</View>
									</View>
								</Animated.View>
							)}
							<View style={styles.listContainer}>
								<FlatList
									ref={flatListRef}
									data={filteredGames}
									renderItem={renderCards}
									numColumns={2}
									contentContainerStyle={{ padding: 5 }}
									keyExtractor={(item) => `${item.storeID}`}
									onScroll={handleScroll}
									scrollEventThrottle={16}
								/>
							</View>
						</>
					)}
				</View>
			</LinearGradient>
		</>
	);
};

export default StoresScreen;

const styles = StyleSheet.create({
	linearGradient: {
		flex: 1,
	},
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	bannerContainer: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'black',
	},
	bannerImageContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	bannerImage: {
		flex: 1,
	},
	bannerTextContainer: {
		flex: 4,
		alignItems: 'center',
		justifyContent: 'center',
	},
	bannerText: {
		fontFamily: Fonts.gameTitleFont,
		fontSize: 23,
		color: Colors.offWhite,
	},
	listContainer: {
		flex: 10,
	},
	cardImage: {
		flex: 1,
		backgroundColor: '#e4e4e4',
		borderRadius: 40,
		aspectRatio: 1,
		elevation: 4,
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.5,
	},
	pressed: {
		opacity: 0.5,
	},
});
