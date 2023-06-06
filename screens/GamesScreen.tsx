import { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import Card from '../components/Card';

export interface TestListData {
	id: string;
	testNumber: number;
}

const GamessScreen = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const dummyData: TestListData[] = [
		{ id: '1', testNumber: 1 },
		{ id: '2', testNumber: 2 },
		{ id: '3', testNumber: 3 },
		{ id: '4', testNumber: 4 },
	];
	const renderCards = ({ item }: { item: TestListData }) => {
		return <Card>{item.testNumber}</Card>;
	};

	function onSearchHandler() {
		console.log(searchQuery);
	}

	return (
		<View style={styles.rootContainer}>
			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					value={searchQuery}
					onChangeText={setSearchQuery}
					placeholder='Search...'
				/>
				<Pressable onPress={onSearchHandler} style={styles.searchButton}>
					<Text style={styles.searchText}>Search</Text>
				</Pressable>
			</View>
			<View style={styles.listContainer}>
				<FlashList
					data={dummyData}
					renderItem={renderCards}
					numColumns={2}
					estimatedItemSize={181}
					contentContainerStyle={{ padding: 5 }}
				/>
			</View>
		</View>
	);
};

export default GamessScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	searchContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: '10%',
		margin: 5,
	},
	searchInput: {
		flex: 3,
		borderWidth: 1,
		borderColor: '#837f7e',
		borderRadius: 89,
		marginRight: 10,
		padding: 5,

		opacity: 0.7,
		justifyContent: 'center',
	},
	searchButton: {
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#837f7e',
		borderRadius: 10,
		opacity: 0.7,
		flex: 1,
		padding: 5,
		justifyContent: 'center',
	},
	searchText: {
		textAlign: 'center',
		fontSize: 12,
		fontWeight: '400',
	},
	listContainer: {
		flex: 9,
	},
});
