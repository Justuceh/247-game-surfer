import { Text, View, StyleSheet, Pressable, Image } from 'react-native';

import { GameDealItem } from '../screens/GameDealsScreen';
import Card from './Card';
import WishlistButton from './WishlistButton';

interface GameDealCardProps {
	gameDealItem: GameDealItem;
	handleGameDealPress: (dealID: string) => void;
}

const GameDealCard = ({
	gameDealItem,
	handleGameDealPress,
}: GameDealCardProps) => {
	return (
		<Card color='#120c0c'>
			<View style={styles.rootContainer}>
				<Pressable
					onPress={() => handleGameDealPress(gameDealItem.dealID)}
					style={({ pressed }) =>
						pressed
							? [styles.pressed, styles.pressableContainer]
							: styles.pressableContainer
					}>
					<View style={styles.imageContainer}>
						<Image style={styles.image} source={{ uri: gameDealItem.thumb }} />
					</View>

					<View style={styles.descriptionContainer}>
						<View style={styles.titleContainer}>
							<Text style={styles.title}>{gameDealItem.title}</Text>
						</View>

						<View style={styles.saleInfoContainer}>
							<Text style={[styles.strikethroughText, styles.saleText]}>
								{gameDealItem.normalPrice}
							</Text>
							<Text style={styles.saleText}>{gameDealItem.salePrice}</Text>
							<WishlistButton gameDealItem={gameDealItem} />
						</View>
					</View>
				</Pressable>
			</View>
		</Card>
	);
};

export default GameDealCard;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
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
	titleContainer: {
		flex: 1,
	},
	title: {
		flex: 1,
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
		marginHorizontal: 4,
	},
	saleText: {
		flex: 1,
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
});
