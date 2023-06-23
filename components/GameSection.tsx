import { FlatList, View, StyleSheet } from 'react-native';
import { GameDealItem } from '../screens/GameDealsScreen';

interface GameSectionProps {
	games: GameDealItem[];
}

const GameSection = ({ games }: GameSectionProps) => {
	function renderGameSection() {
		return <View></View>;
	}

	return (
		<View>
			<FlatList
				data={games}
				keyExtractor={(item) => item.dealID}
				numColumns={2}
				renderItem={renderGameSection}
			/>
		</View>
	);
};

export default GameSection;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
	},
});
