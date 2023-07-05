import { useContext } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { CHEAPSHARK_BASE_URL } from '@env';

import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import GameDealItem from '../models/GameDealItem';
import { GameStoreContext } from '../store/context/game_deals/game-stores-context';

interface GameReviewScoreProps {
	game: GameDealItem | undefined;
	releaseDate: string;
}

const GameReviewScore = ({ game, releaseDate }: GameReviewScoreProps) => {
	const storesContext = useContext(GameStoreContext);
	const storeIcon = storesContext.stores.find(
		(store) => store.storeID === game?.storeID
	)?.images.logo;
	const storeIconUri = `${CHEAPSHARK_BASE_URL}${storeIcon}`;

	return (
		<View style={styles.rootContainer}>
			<View style={styles.reviewsContainer}>
				<Text style={styles.reviewLabel}>
					Steam-{' '}
					<Text style={styles.review}>
						{`(${game?.steamRatingPercent}% of ${game?.steamRatingCount}) ALL TIME`}
					</Text>
				</Text>

				<Text style={styles.reviewLabel}>
					Metacritic -{' '}
					<Text style={styles.review}>{game?.metacriticScore}</Text>
				</Text>
				<Text style={styles.reviewLabel}>
					Release Date - <Text style={styles.review}>{releaseDate}</Text>
				</Text>
			</View>
			<View style={styles.iconContainer}>
				<Image
					style={styles.iconImage}
					source={{ uri: storeIconUri }}
					resizeMode='contain'
				/>
			</View>
		</View>
	);
};

export default GameReviewScore;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 20,
	},
	reviewsContainer: {
		flex: 4,
	},
	reviewLabel: {
		color: Colors.offWhite,
		padding: 5,
		fontSize: 18,
		fontWeight: '400',
	},
	review: {
		color: '#f7b4a6',
		fontSize: 18,
		fontWeight: '200',
		fontFamily: Fonts.gameTitleFont,
	},
	iconContainer: {
		flex: 1,
		marginRight: 20,
	},
	iconImage: {
		aspectRatio: 1,
	},
});
