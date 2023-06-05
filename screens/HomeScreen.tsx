import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import Card from '../components/Card';

const HomeScreen: React.FC = () => {
	const dummyData: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const renderCards = ({ item }: { item: number }) => {
		return <Card>{item}</Card>;
	};

	return (
		<View style={styles.rootContainer}>
			<FlatList
				data={dummyData}
				keyExtractor={(item) => `${item}`}
				renderItem={renderCards}
				numColumns={2}
				style={styles.cardList}
			/>
		</View>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	cardList: {
		flex: 1,
	},
});
