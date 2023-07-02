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
					Steam-{' '}
					<Text style={styles.review}>
						{`(${game?.steamRatingPercent}% of ${game?.steamRatingCount}) ALL TIME`}
					</Text>
				</Text>

				<Text style={styles.reviewLabel}>
					Metacritic -{' '}
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
});
