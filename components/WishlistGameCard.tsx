import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, Pressable } from 'react-native';
import WishlistGame from '../models/WishlistGame';
import Card from './Card';
import Fonts from '../constants/fonts';
import Colors from '../constants/colors';

interface WishlistCardProps {
	wishlistGame: WishlistGame;
}

const WishlistGameCard = ({ wishlistGame }: WishlistCardProps) => {
	const [gameImageHeight, setGameImageHeight] = useState<number>(0);
	const [gameImageWidth, setGameImageWidth] = useState<number>(0);

	useEffect(() => {
		Image.getSize(
			wishlistGame.thumb,
			(width, height) => {
				setGameImageHeight(height);
				setGameImageWidth(width);
			},
			(error) => {
				console.error('Failed to get image dimensions:', error);
			}
		);
	}, [wishlistGame.thumb]);
	const calculatedWidth = gameImageWidth > 130 ? 160 : gameImageWidth + 50;
	const calculatedHeight = gameImageHeight > 190 ? 120 : gameImageHeight + 60;

	function handleWishlistItemPress(item: WishlistGame) {}
	return (
		<Card style={{ backgroundColor: Colors.charcoalDark }}>
			<Pressable
				onPress={() => handleWishlistItemPress(wishlistGame)}
				style={({ pressed }) =>
					pressed
						? [styles.pressed, styles.pressableContainer]
						: styles.pressableContainer
				}>
				<View style={styles.rootContainer}>
					<View style={styles.imageContainer}>
						<Image
							style={[
								{
									height: calculatedHeight,
									width: calculatedWidth,
								},
							]}
							source={{ uri: wishlistGame.thumb }}
							resizeMode='contain'
						/>
					</View>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>{wishlistGame.title}</Text>
					</View>
				</View>
			</Pressable>
		</Card>
	);
};

export default WishlistGameCard;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
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
		justifyContent: 'center',
		margin: '1%',
	},
	titleContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		textAlign: 'center',
		fontFamily: Fonts.gameTitleFont,
		color: 'white',
		fontSize: 18,
		marginHorizontal: 8,
	},
});
