import { View, Text, StyleSheet, FlatList } from 'react-native';
import { GameDealItem } from '../screens/GameDealsScreen';

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
				<Text style={styles.categoryText}>Category 1</Text>
			</View>
			<FlatList
				data={data}
				keyExtractor={(item) => item.dealID}
				renderItem={renderItem}
				horizontal={true}
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
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#beb5b5',
		padding: 8,
	},
	listContainer: {
		height: 300,
	},
});
