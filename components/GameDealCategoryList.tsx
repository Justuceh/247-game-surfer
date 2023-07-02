import { View, StyleSheet, FlatList } from 'react-native';

import { GameDealItem } from '../screens/GameDealsScreen';
import Fonts from '../constants/fonts';

interface GameDealCategoryListProps {
	data: GameDealItem[] | undefined;
	renderItem: ({ item }: any) => any;
}

const GameDealCategoryList = ({
	data,
	renderItem,
}: GameDealCategoryListProps) => {
	return (
		<View style={styles.listContainer}>
			<FlatList
				data={data}
				keyExtractor={(item) => item.dealID}
				numColumns={2}
				renderItem={renderItem}
			/>
		</View>
	);
};

export default GameDealCategoryList;

const styles = StyleSheet.create({
	categoryContainer: {
		borderBottomWidth: 1,
		borderBottomColor: 'black',
	},
	categoryText: {
		fontSize: 23,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#ebdfdf',
		padding: 5,
	},
	listContainer: {
		flex: 1,
	},
});
