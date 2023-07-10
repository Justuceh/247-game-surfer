import {
	Text,
	View,
	StyleSheet,
	Pressable,
	Image,
	Dimensions,
} from 'react-native';
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
			<View style={styles.leftRow}>
				<Image
					style={styles.iconImage}
					source={{ uri: storeIconUri }}
					resizeMode='contain'
				/>
				<Text style={styles.savingsPercent}>-{savingsPercent}</Text>
			</View>

			<View style={styles.rightRow}>
				<Text style={styles.strikeThroughText}>{gameDeal?.retailPrice}</Text>
				<Text style={styles.saleText}>${gameDeal?.price}</Text>
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
	);
};

export default FavoritesPriceLabel;
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		width: width,
	},
	rightRow: {
		flex: 2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	leftRow: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	savingsPercent: {
		flex: 0.5,
		textAlign: 'center',
		fontWeight: '400',
		color: Colors.charcoalDark,
		fontFamily: Fonts.openSans_400Regular,
		fontSize: 22,
		marginLeft: 20,
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
		flex: 1.5,
		justifyContent: 'center',
		color: 'yellow',
		fontSize: 21,
		fontFamily: Fonts.openSans_400Regular,
		marginLeft: 10,
	},
	strikeThroughText: {
		flex: 1.5,
		justifyContent: 'center',
		textAlign: 'right',
		fontSize: 20,
		fontFamily: Fonts.openSans_400Regular,
		color: Colors.offWhite,
		textDecorationLine: 'line-through',
	},

	iconImage: {
		flex: 0.5,
		height: 60,
	},
	dealButton: {
		flex: 1.6,
		backgroundColor: '#56ff7b',
		borderWidth: 1,
		borderColor: '#bd1010',
		borderRadius: 10,
		opacity: 0.9,
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
