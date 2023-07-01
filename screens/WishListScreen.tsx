import { useContext, useEffect, useRef, useState } from 'react';
import {
	Animated,
	LayoutAnimation,
	View,
	StyleSheet,
	Text,
} from 'react-native';
import { WishlistContext } from '../store/context/wishlist/wishlist-context';

import GameList from '../components/GameList';
import Banner from '../components/Banner';
import Fonts from '../constants/fonts';
import Colors from '../constants/colors';

const WishListScreen = () => {
	const wishListGames = useContext(WishlistContext);
	const [bannerVisible, setBannerVisible] = useState(true);

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

	return (
		<View style={styles.rootContainer}>
			{bannerVisible && (
				<Animated.View
					style={[styles.bannerContainer, { opacity: bannerOpacity }]}>
					<Banner>
						<View style={styles.bannerTextContainer}>
							<Text style={styles.bannerText}>SURF Your Wishlist!</Text>
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
				<GameList
					games={wishListGames.games}
					handleScroll={handleScroll}
					scrollThreshold={scrollThreshold}
				/>
			</View>
		</View>
	);
};

export default WishListScreen;

const styles = StyleSheet.create({
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
	},
	noBanner: {
		paddingTop: 10,
		backgroundColor: Colors.charcoalLight,
	},
});
