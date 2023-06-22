import { View, StyleSheet } from 'react-native';

import { GameDealItem } from '../screens/GameDealsScreen';

interface GameDealCardProps {
	gameDealItem: GameDealItem;
}

const GameDealCard = ({ gameDealItem }: GameDealCardProps) => {
	return <View style={styles.rootContainer}></View>;
};

export default GameDealCard;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		color: ' #66ff00',
	},
});
