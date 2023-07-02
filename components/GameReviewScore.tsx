import { Text, View, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import { GameDealItem } from '../screens/GameDealsScreen';

interface GameReviewScoreProps {
	game: GameDealItem | undefined;
}

const GameReviewScore = ({ game }: GameReviewScoreProps) => {
	return (
		<View style={styles.rootContainer}>
			<View style={styles.reviewsContainer}>
				<Text style={styles.reviewLabel}>
					Steam:{' '}
					<Text
						style={
							styles.review
						}>{`${game?.steamRatingPercent}% out of ${game?.steamRatingCount} Reviews`}</Text>
				</Text>
				<Text style={styles.reviewLabel}>
					Metacritic Score:{' '}
					<Text style={styles.review}>{game?.metacriticScore}</Text>
				</Text>
			</View>
		</View>
	);
};

export default GameReviewScore;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		width: '100%',
	},
	reviewsContainer: {
		flex: 1,
	},
	reviewLabel: {
		padding: 5,
		color: Colors.offWhite,
		fontSize: 20,
		fontWeight: 'bold',
		fontFamily: Fonts.gameTitleFont,
	},
	review: {
		color: Colors.offWhite,
		fontSize: 18,
	},
});
