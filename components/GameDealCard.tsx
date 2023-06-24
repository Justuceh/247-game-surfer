import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Image } from 'react-native';

import { GameDealItem } from '../screens/GameDealsScreen';
import Card from './Card';
import WishlistButton from './WishlistButton';

interface GameDealCardProps {
	gameDealItem: GameDealItem;
	handleGameDealPress: (dealID: string) => void;
	style?: {
		width?: number;
	};
}

const GameDealCard = ({
	gameDealItem,
	handleGameDealPress,
	style,
}: GameDealCardProps) => {
	//TODO write a function to calculate the percentage in savings and add a savings percentage to the card

	const [imageHeight, setImageHeight] = useState<number>();
	const [imageWidth, setImageWidth] = useState<number>();

	useEffect(() => {
		Image.getSize(
			gameDealItem.thumb,
			(width, height) => {
				setImageHeight(height);
				setImageWidth(width);
			},
			(error) => {
				console.error('Failed to get image dimensions:', error);
			}
		);
		test();
	}, [gameDealItem.thumb]);

	function test() {
		if (
			gameDealItem.title === 'Far Cry 5 Gold Edition' ||
			gameDealItem.title === 'Rayman Origins'
		) {
			console.log(
				`${gameDealItem.title}: width: ${imageWidth}, height: ${imageHeight}`
			);
		}
	}
	const calculatedWidth =
		imageWidth !== undefined && imageWidth > 190 ? 190 : imageWidth;
	const calculatedHeight =
		imageHeight !== undefined && imageHeight > 200 ? 200 : imageHeight;
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
							styles.image,
							{ height: calculatedHeight, width: calculatedWidth },
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
		flex: 3,
		alignItems: 'center',
		margin: '1%',
		padding: 12,
	},
	image: {
		borderRadius: 10,
		flex: 1,
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
		flex: 1,
		fontWeight: '400',
		justifyContent: 'center',
		color: 'yellow',
	},
	strikethroughText: {
		flex: 2,
		fontWeight: '400',
		justifyContent: 'center',
		color: 'yellow',
	},
	strikeThrough: {
		color: 'white',
		textDecorationLine: 'line-through',
	},
});
