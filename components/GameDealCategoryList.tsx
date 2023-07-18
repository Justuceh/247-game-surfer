import { useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import GameDealItem from '../models/GameDealItem';

interface GameDealCategoryListProps {
	data: GameDealItem[] | undefined;
	renderItem: ({ item }: any) => any;
	handleScroll?: (event: any) => void | undefined;
	scrollThreshold?: number | undefined;
	onEndReached?: (event: any) => void;
	onEndReachedThreshold?: number;
	footerComponent?: any;
}

const GameDealCategoryList = ({
	data,
	renderItem,
	handleScroll,
	scrollThreshold,
	onEndReached,
	onEndReachedThreshold,
	footerComponent,
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
				showsVerticalScrollIndicator={false}
				onEndReached={onEndReached}
				onEndReachedThreshold={onEndReachedThreshold}
				ListFooterComponent={footerComponent}
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
