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
				renderItem={renderItem}
				horizontal={true}
			/>
		</View>
	);
};

export default GameDealCategoryList;

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
	categoryContainer: {
		borderBottomWidth: 1,
		borderBottomColor: 'black',
		elevation: 4,
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.6,
	},
	categoryText: {
		fontSize: 20,
		fontFamily: Fonts.itim,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#e4dfdf',
		padding: 5,
	},
	listContainer: {
		height: height / 3.2,
	},
});
