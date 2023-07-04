import { useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import GameDealCard from '../components/GameDealCard';
import { GameDealItem } from '../models/GameDealItem';
import Colors from '../constants/colors';
import GameDetails from './GameDetails';
import GameDealCategoryList from './GameDealCategoryList';

interface GameListProps {
	games: GameDealItem[] | undefined;
	handleScroll?: (event: any) => void | undefined;
	scrollThreshold?: number | undefined;
}

const GameList = ({ games, handleScroll, scrollThreshold }: GameListProps) => {
	const [showGameDetails, setShowGameDetails] = useState(false);
	const [modalDealItem, setModalDealItem] = useState<GameDealItem>();

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
			<GameDealCard
				gameDealItem={item}
				handleGameDealPress={openGameDetailsModal}
			/>
		);
	};

	return (
		<>
			<LinearGradient
				style={styles.linearGradient}
				colors={[
					Colors.linearGradient.topColor,
					Colors.linearGradient.middleColor,
					Colors.linearGradient.bottomColor,
				]}>
				<View style={styles.rootContainer}>
					<View style={styles.scrollContainer}>
						<View style={styles.listItemContainer}>
							<>
								{showGameDetails && (
									<GameDetails
										showDetails={showGameDetails}
										onClose={closeGameDetailsModal}
										gameDealItem={modalDealItem}
									/>
								)}
								<GameDealCategoryList
									handleScroll={handleScroll}
									scrollThreshold={scrollThreshold}
									data={games}
									renderItem={renderCards}
								/>
							</>
						</View>
					</View>
				</View>
			</LinearGradient>
		</>
	);
};

export default GameList;
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
	linearGradient: {
		flex: 1,
	},
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	filterContainer: {
		flex: 1.2,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.charcoalLight,
	},
	scrollContainer: {
		flex: 11,
	},
	activityIndicatorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	listItemContainer: {
		flex: 1,
		elevation: 4,
		shadowColor: '#c7c7c7',
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 4,
		shadowOpacity: 0.5,
	},
});
