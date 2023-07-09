import { useContext, useEffect, useRef, useState } from 'react';
import {
	Animated,
	LayoutAnimation,
	View,
	StyleSheet,
	Text,
	FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { WishlistContext } from '../store/context/wishlist/wishlist-context';
import Banner from '../components/Banner';
import Fonts from '../constants/fonts';
import Colors from '../constants/colors';
import WishlistGame from '../models/WishlistGame';
import WishlistGameCard from '../components/WishlistGameCard';

const WishListScreen = () => {
	const wishListGames = useContext(WishlistContext);
	const [bannerVisible, setBannerVisible] = useState(true);
	const flatListRef = useRef<FlatList<WishlistGame>>(null);

	const bannerOpacity = useRef(new Animated.Value(1)).current;
	useEffect(() => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	}, [bannerVisible]);

	useEffect(() => {
		Animated.timing(bannerOpacity, {
			toValue: bannerVisible ? 1 : 0,
			duration: 1000, // Adjust the animation duration as needed
			useNativeDriver: true,
		}).start();
	}, [bannerVisible]);

	const scrollThreshold = 200; // Adjust the scroll threshold as needed

	const handleScroll = (event: any) => {
		const offsetY = event.nativeEvent.contentOffset.y;
		if (offsetY >= scrollThreshold && bannerVisible) {
			setBannerVisible(false);
		} else if (offsetY < scrollThreshold && !bannerVisible) {
			setBannerVisible(true);
		}
	};

	function renderWishlistItem({ item }: { item: WishlistGame }) {
		return <WishlistGameCard wishlistGame={item} />;
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
				<View style={styles.rootContainer}>
					{bannerVisible && (
						<Animated.View
							style={[styles.bannerContainer, { opacity: bannerOpacity }]}>
							<Banner>
								<View style={styles.bannerTextContainer}>
									<Text style={styles.bannerText}>
										SURF Your Favorite Games!
									</Text>
								</View>
							</Banner>
						</Animated.View>
					)}
					<View
						style={
							bannerVisible
								? styles.gameListContainer
								: [styles.gameListContainer, styles.noBanner]
						}>
						<FlatList
							data={wishListGames.games}
							keyExtractor={(item) => item.id}
							numColumns={2}
							renderItem={renderWishlistItem}
							ref={flatListRef}
							onScroll={handleScroll}
							scrollEventThrottle={scrollThreshold}
						/>
					</View>
				</View>
			</LinearGradient>
		</>
	);
};

export default WishListScreen;

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
	gameListContainer: {
		flex: 10,
		elevation: 4,
		shadowColor: '#c7c7c7',
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 4,
		shadowOpacity: 0.5,
	},
	noBanner: {
		paddingTop: 10,
		backgroundColor: Colors.charcoalLight,
	},
});
