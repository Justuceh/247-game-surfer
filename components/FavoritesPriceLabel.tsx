import { Text, View, StyleSheet, Pressable, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { CHEAPSHARK_BASE_URL, CHEAPSHARK_REDIRECT_API } from '@env';

import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import GameDeal from '../models/GameDeal';
import { useContext, useState } from 'react';
import { GameStoreContext } from '../store/context/game_deals/game-stores-context';

interface FavoritesPriceLabelProps {
	gameDeal: GameDeal | undefined;
}

const FavoritesPriceLabel = ({ gameDeal }: FavoritesPriceLabelProps) => {
	const storesContext = useContext(GameStoreContext);
	const storeIcon = storesContext.stores.find(
		(store) => store.storeID === gameDeal?.storeID
	)?.images.logo;
	const storeIconUri = `${CHEAPSHARK_BASE_URL}${storeIcon}`;
	let savingsPercent;
	if (gameDeal?.savings) {
		savingsPercent = `${gameDeal?.savings.split('.')[0]}%`;
	}

	const openBrowserAsync = async (dealID: string | undefined) => {
		await WebBrowser.openBrowserAsync(`${CHEAPSHARK_REDIRECT_API}${dealID}`);
	};
	return (
		<View style={styles.rootContainer}>
			<View style={styles.pricesContainer}>
				<View style={styles.saleInfoContainer}>
					<View style={styles.iconContainer}>
						<Image
							style={styles.iconImage}
							source={{ uri: storeIconUri }}
							resizeMode='contain'
						/>
					</View>
					<Text style={styles.strikeThroughText}>{gameDeal?.retailPrice}</Text>
					<Text style={styles.saleText}>${gameDeal?.price}</Text>
					<View style={styles.savingsPercentContainer}>
						<Text style={styles.savingsPercent}>-{savingsPercent}</Text>
					</View>
					<Pressable
						onPress={() => openBrowserAsync(gameDeal?.dealID)}
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

export default FavoritesPriceLabel;

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
		margin: 2,
		marginLeft: 15,
	},
	savingsPercent: {
		fontWeight: '400',
		color: Colors.charcoalDark,
		fontFamily: Fonts.itimFont,
		fontSize: 18,
		backgroundColor: Colors.neonGreen,
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
		fontFamily: Fonts.itimFont,
	},
	strikeThroughText: {
		flex: 1,
		justifyContent: 'center',
		fontSize: 20,
		fontFamily: Fonts.itimFont,
		color: Colors.offWhite,
		textDecorationLine: 'line-through',
	},
	iconContainer: {
		flex: 0.9,
		justifyContent: 'flex-start',
		marginRight: 20,
	},
	iconImage: {
		aspectRatio: 1,
	},
	dealButton: {
		backgroundColor: '#56ff7b',
		borderWidth: 1,
		borderColor: '#bd1010',
		borderRadius: 10,
		opacity: 0.9,
		flex: 1,
		padding: 4,
		justifyContent: 'center',
	},
	dealButtonText: {
		textAlign: 'center',
		color: Colors.charcoalDark,
		fontFamily: Fonts.itimFont,
		fontSize: 15,
	},
});
