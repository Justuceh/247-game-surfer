import { useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import { GameDealItem } from '../screens/GameDealsScreen';

interface GameDealCategoryListProps {
	data: GameDealItem[] | undefined;
	renderItem: ({ item }: any) => any;
	handleScroll?: (event: any) => void | undefined;
	scrollThreshold?: number | undefined;
}

const GameDealCategoryList = ({
	data,
	renderItem,
	handleScroll,
	scrollThreshold,
}: GameDealCategoryListProps) => {
	const flatListRef = useRef<FlatList<GameDealItem>>(null);
	return (
		<View style={styles.listContainer}>
			<FlatList
				data={data}
				keyExtractor={(item) => item.dealID}
				numColumns={2}
				renderItem={renderItem}
				ref={flatListRef}
				onScroll={handleScroll}
				scrollEventThrottle={scrollThreshold}
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
