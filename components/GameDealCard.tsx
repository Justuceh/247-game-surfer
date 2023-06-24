import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Image } from 'react-native';

import { GameStoreContext } from '../store/context/game_deals/game-stores-context';
import { GameDealItem } from '../screens/GameDealsScreen';
import Card from './Card';
import WishlistButton from './WishlistButton';
import { CHEAPSHARK_BASE_URL } from '@env';

interface GameDealCardProps {
	gameDealItem: GameDealItem;
	handleGameDealPress: (dealID: string) => void;
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
	//TODO write a function to calculate the percentage in savings and add a savings percentage to the card
	const storesContext = useContext(GameStoreContext);
	const [gameImageHeight, setGameImageHeight] = useState<number>(0);
	const [gameImageWidth, setGameImageWidth] = useState<number>(0);
	const [storeIconImageHeight, setStoreIconImageHeight] = useState<number>(0);
	const [storeIconImageWidth, setStoreIconImageWidth] = useState<number>(0);
	const storeIcon = storesContext.stores.find(
		(store) => store.storeID === gameDealItem.storeID
	)?.images.icon;
	const storeIconUri = `${CHEAPSHARK_BASE_URL}${storeIcon}`;

	useLayoutEffect(() => {
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

	useLayoutEffect(() => {
		Image.getSize(
			storeIconUri,
			(width, height) => {
				setStoreIconImageHeight(height);
				setStoreIconImageWidth(width);
			},
			(error) => {
				console.error('Failed to get image dimensions:', error);
			}
		);
	}, [storeIcon]);

	const calculatedWidth = gameImageWidth > 190 ? 190 : gameImageWidth + 50;
	const calculatedHeight = gameImageHeight > 190 ? 120 : gameImageHeight + 60;
	return (
		<Card style={{ backgroundColor: '#120c0c', aspectRatio: 1 }}>
			<Pressable
				onPress={() => handleGameDealPress(gameDealItem.dealID)}
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

					<View style={styles.saleInfoContainer}>
						<Text style={styles.saleText}>{gameDealItem.salePrice}</Text>
						<Text style={[styles.strikethroughText, styles.strikeThrough]}>
							{gameDealItem.normalPrice}
						</Text>
						<Image
							style={{
								width: storeIconImageWidth,
								height: storeIconImageHeight,
								flex: 1,
								padding: 1,
								marginRight: 6,
							}}
							source={{ uri: storeIconUri }}
							resizeMode='contain'
						/>
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
		fontWeight: 'bold',
		color: 'white',
		fontSize: 15,
		padding: 4,
		margin: 4,
	},
	saleInfoContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 10,
	},
	saleText: {
		flex: 2,
		fontWeight: '400',
		justifyContent: 'center',
		color: 'yellow',
		//marginRight: 9,
	},
	strikethroughText: {
		flex: 2,
		fontWeight: '400',
		justifyContent: 'center',
		color: 'yellow',
		//marginLeft: 4,
	},
	strikeThrough: {
		color: 'white',
		textDecorationLine: 'line-through',
	},
});
