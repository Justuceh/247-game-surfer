import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { LinearGradient } from 'expo-linear-gradient';

import GameDealCard from '../components/GameDealCard';
import { CHEAPSHARK_REDIRECT_API } from '@env';
import { GameDealItem } from '../screens/GameDealsScreen';
import Colors from '../constants/colors';

interface GameListProps {
	games: GameDealItem[] | undefined;
}

const GameList = ({ games }: GameListProps) => {
	const openBrowserAsync = async (dealID: string) => {
		await WebBrowser.openBrowserAsync(`${CHEAPSHARK_REDIRECT_API}${dealID}`);
	};
	const renderCards = ({ item }: { item: GameDealItem }) => {
		return (
			<View style={styles.gameDealItemContainer}>
				<GameDealCard
					gameDealItem={item}
					handleGameDealPress={openBrowserAsync}
					style={{ height: 100 }}
				/>
			</View>
		);
	};

	return (
		<View style={styles.linearGradient}>
			<LinearGradient
				style={styles.linearGradient}
				colors={[
					Colors.linearGradient.topColor,
					Colors.linearGradient.middleColor,
					Colors.linearGradient.bottomColor,
				]}>
				<View style={styles.listContainer}>
					<FlatList
						data={games}
						renderItem={renderCards}
						contentContainerStyle={{ padding: 5 }}
						numColumns={2}
						keyExtractor={(item) => `${item.dealID}`}
					/>
				</View>
			</LinearGradient>
		</View>
	);
};

export default GameList;
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#282828',
	},
	linearGradient: {
		flex: 1,
	},
	listContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 4,
		shadowColor: 'black',
		shadowOffset: { width: 4, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.5,
	},
	gameDealItemContainer: {
		width: width / 2,
	},
});
