import { useRef, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import GameDealCard from '../components/GameDealCard';
import { GameDealItem } from '../screens/GameDealsScreen';
import Colors from '../constants/colors';
import GameDetails from './GameDetails';

interface GameListProps {
	games: GameDealItem[] | undefined;
	handleScroll?: (event: any) => void | undefined;
	scrollThreshold?: number | undefined;
}

const GameList = ({ games, handleScroll, scrollThreshold }: GameListProps) => {
	const [showGameDetails, setShowGameDetails] = useState(false);
	const [modalDealItem, setModalDealItem] = useState<GameDealItem>();
	const flatListRef = useRef<FlatList<GameDealItem>>(null);

	function closeGameDetailsModal() {
		setShowGameDetails(false);
		setModalDealItem(undefined);
	}
	function openGameDetailsModal(dealItem: GameDealItem) {
		setShowGameDetails(true);
		setModalDealItem(dealItem);
	}
	const renderCards = ({ item }: { item: GameDealItem }) => {
		return (
			<View style={styles.gameDealItemContainer}>
				<GameDealCard
					gameDealItem={item}
					handleGameDealPress={openGameDetailsModal}
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
					{showGameDetails && (
						<GameDetails
							showDetails={showGameDetails}
							onClose={closeGameDetailsModal}
							gameDealItem={modalDealItem}
						/>
					)}
					<FlatList
						ref={flatListRef}
						onScroll={handleScroll}
						scrollEventThrottle={scrollThreshold}
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
