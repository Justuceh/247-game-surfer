import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';

import { GameDealItem } from '../screens/GameDealsScreen';
import Fonts from '../constants/fonts';

interface GameDealCategoryListProps {
	categoryText: string;
	data: GameDealItem[] | undefined;
	renderItem: ({ item }: any) => any;
}

const GameDealCategoryList = ({
	categoryText,
	data,
	renderItem,
}: GameDealCategoryListProps) => {
	return (
		<View style={styles.listContainer}>
			<View style={styles.categoryContainer}>
				<Text style={styles.categoryText}>{categoryText}</Text>
			</View>
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
