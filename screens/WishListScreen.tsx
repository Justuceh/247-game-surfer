import { useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { WishlistContext } from '../store/context/wishlist/wishlist-context';

import Card from '../components/Card';
import { GameDealItem } from './GameDealsScreen';
import GameDealCard from '../components/GameDealCard';
import { CHEAPSHARK_REDIRECT_API } from '@env';

const WishListScreen = () => {
	const wishListGames = useContext(WishlistContext);
	const openBrowserAsync = async (dealID: string) => {
		await WebBrowser.openBrowserAsync(`${CHEAPSHARK_REDIRECT_API}${dealID}`);
	};
	const renderCards = ({ item }: { item: GameDealItem }) => {
		return (
			<View style={styles.wishListItemContainer}>
				<GameDealCard
					gameDealItem={item}
					handleGameDealPress={openBrowserAsync}
					style={{ width: 165 }}
				/>
			</View>
		);
	};

	return (
		<View style={styles.rootContainer}>
			<FlatList
				data={wishListGames.games}
				renderItem={renderCards}
				numColumns={2}
				keyExtractor={(item) => `${item.dealID}`}
			/>
		</View>
	);
};

export default WishListScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#282828',
	},
	wishListItemContainer: {
		width: 200,
		overflow: 'hidden',
	},
});
