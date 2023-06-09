import { Text, View, StyleSheet, Pressable, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { CHEAPSHARK_REDIRECT_API } from '@env';

import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import GameDeal from '../models/GameDeal';

interface PriceLabelProps {
	game: GameDeal | undefined;
}

const PriceLabel = ({ game }: PriceLabelProps) => {
	let savingsPercent;
	if (game?.savings) {
		savingsPercent = `${game?.savings.split('.')[0]}%`;
	}

	const openBrowserAsync = async (dealID: string | undefined) => {
		await WebBrowser.openBrowserAsync(`${CHEAPSHARK_REDIRECT_API}${dealID}`);
	};
	return (
		<View style={styles.rootContainer}>
			<View style={styles.savingsPercentContainer}>
				<Text style={styles.savingsPercent}>-{savingsPercent}</Text>
			</View>
			<View style={styles.pricesContainer}>
				<View style={styles.saleInfoContainer}>
					<Text style={styles.saleText}>${game?.price}</Text>
					<Text style={styles.strikeThroughText}>{game?.retailPrice}</Text>
					<Pressable
						onPress={() => openBrowserAsync(game?.dealID)}
						style={({ pressed }) => [
							styles.dealButton,
							{ opacity: pressed ? 0.2 : 0.9 },
						]}>
						<Text style={styles.dealButtonText}>Get Deal!</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
};

export default PriceLabel;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		padding: 10,
		width: '100%',
	},
	savingsPercentContainer: {
		flex: 1,
		alignItems: 'flex-start',
		justifyContent: 'center',
		margin: 4,
		marginLeft: 15,
	},
	savingsPercent: {
		fontWeight: '400',
		color: Colors.charcoalDark,
		fontFamily: Fonts.openSans_400Regular,
		fontSize: 18,
		backgroundColor: Colors.neonGreen,
		padding: 3,
	},
	pricesContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	saleInfoContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 9,
	},
	saleText: {
		flex: 1,
		color: 'yellow',
		fontSize: 20,
		fontFamily: Fonts.openSans_400Regular,
	},
	strikeThroughText: {
		flex: 2.5,
		justifyContent: 'center',
		fontSize: 20,
		fontFamily: Fonts.openSans_400Regular,
		color: Colors.offWhite,
		textDecorationLine: 'line-through',
	},
	dealButton: {
		backgroundColor: '#56ff7b',
		borderWidth: 1,
		borderColor: '#bd1010',
		borderRadius: 10,
		opacity: 0.9,
		flex: 1,
		padding: 5,
		justifyContent: 'center',
	},
	dealButtonText: {
		textAlign: 'center',
		color: Colors.charcoalDark,
		fontFamily: Fonts.openSans_400Regular,
		fontSize: 15,
	},
});
