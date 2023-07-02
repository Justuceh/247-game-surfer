import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { GameDealItem } from '../screens/GameDealsScreen';
import Card from './Card';
import WishlistButton from './WishlistButton';
import { CHEAPSHARK_REDIRECT_API } from '@env';
import Fonts from '../constants/fonts';
import Colors from '../constants/colors';

interface GameDealCardProps {
	gameDealItem: GameDealItem;
	handleGameDealPress: (gameDealItem: GameDealItem) => void;
	style?: {
		width?: number;
		height?: number;
	};
}

const GameDealCard = ({
	gameDealItem,
	handleGameDealPress,
	style,
}: GameDealCardProps) => {
	const [gameImageHeight, setGameImageHeight] = useState<number>(0);
	const [gameImageWidth, setGameImageWidth] = useState<number>(0);
	const savingsPercent = `${gameDealItem.savings.split('.')[0]}%`;

	const openBrowserAsync = async (dealID: string) => {
		await WebBrowser.openBrowserAsync(`${CHEAPSHARK_REDIRECT_API}${dealID}`);
	};

	useEffect(() => {
		Image.getSize(
			gameDealItem.thumb,
			(width, height) => {
				setGameImageHeight(height);
				setGameImageWidth(width);
			},
			(error) => {
				console.error('Failed to get image dimensions:', error);
			}
		);
	}, [gameDealItem.thumb]);

	const calculatedWidth = gameImageWidth > 130 ? 160 : gameImageWidth + 50;
	const calculatedHeight = gameImageHeight > 190 ? 120 : gameImageHeight + 60;
	return (
		<Card style={{ backgroundColor: Colors.charcoalDark }}>
			<Pressable
				onPress={() => handleGameDealPress(gameDealItem)}
				onLongPress={() => openBrowserAsync(gameDealItem.dealID)}
				style={({ pressed }) =>
					pressed
						? [styles.pressed, styles.pressableContainer]
						: styles.pressableContainer
				}>
				<View style={[styles.imageContainer, style && { width: style.width }]}>
					<Image
						style={[
							{
								height: style?.height || calculatedHeight,
								width: style?.width || calculatedWidth,
							},
						]}
						source={{ uri: gameDealItem.thumb }}
						resizeMode='contain'
					/>
				</View>

				<View style={styles.descriptionContainer}>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>{gameDealItem.title}</Text>
					</View>
					<View style={styles.savingsPercentContainer}>
						<Text style={styles.savingsPercent}>{savingsPercent}</Text>
					</View>
					<View style={styles.saleInfoContainer}>
						<Text style={styles.saleText}>{gameDealItem.salePrice}</Text>
						<Text style={[styles.strikethroughText, styles.strikeThrough]}>
							{gameDealItem.normalPrice}
						</Text>

						<WishlistButton gameDealItem={gameDealItem} />
					</View>
				</View>
			</Pressable>
		</Card>
	);
};

export default GameDealCard;

const styles = StyleSheet.create({
	pressableContainer: {
		flex: 1,
	},
	pressed: {
		opacity: 0.5,
	},
	imageContainer: {
		flex: 2,
		alignItems: 'center',
		justifyContent: 'center',
		margin: '1%',
	},
	descriptionContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		overflow: 'hidden',
	},
	title: {
		textAlign: 'center',
		fontFamily: Fonts.gameTitleFont,
		color: 'white',
		fontSize: 18,
		marginHorizontal: 8,
	},
	saleInfoContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 9,
	},
	saleText: {
		flex: 1.5,
		fontWeight: '400',
		justifyContent: 'center',
		color: 'yellow',
		fontFamily: Fonts.saletextFont,
		fontSize: 18,
	},
	strikethroughText: {
		flex: 1.5,
		fontWeight: '400',
		justifyContent: 'center',
		color: 'yellow',
		fontFamily: Fonts.saletextFont,
		fontSize: 15,
	},
	strikeThrough: {
		color: 'white',
		textDecorationLine: 'line-through',
	},
	savingsPercentContainer: {
		flex: 1,
		alignItems: 'center',
	},
	savingsPercent: {
		flex: 1,
		fontWeight: '400',
		justifyContent: 'center',
		color: 'yellow',
		fontFamily: Fonts.saletextFont,
		fontSize: 20,
		padding: 5,
		marginTop: 5,
	},
});
