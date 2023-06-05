import { View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import Card from '../components/Card';

export interface TestListData {
	id: string;
	testNumber: number;
}

const StoresScreen = () => {
	const dummyData: TestListData[] = [
		{ id: '1', testNumber: 1 },
		{ id: '2', testNumber: 2 },
		{ id: '3', testNumber: 3 },
		{ id: '4', testNumber: 4 },
		{ id: '4', testNumber: 4 },
		{ id: '4', testNumber: 4 },
		{ id: '4', testNumber: 4 },
		{ id: '4', testNumber: 4 },
		{ id: '4', testNumber: 4 },
		{ id: '4', testNumber: 4 },
		{ id: '4', testNumber: 4 },
		{ id: '4', testNumber: 4 },
	];
	const renderCards = ({ item }: { item: TestListData }) => {
		return <Card>{item.testNumber}</Card>;
	};

	return (
		<View style={styles.rootContainer}>
			<FlashList
				data={dummyData}
				renderItem={renderCards}
				numColumns={2}
				estimatedItemSize={181}
				contentContainerStyle={{ padding: 5 }}
			/>
		</View>
	);
};

export default StoresScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	cardList: {
		flex: 1,
	},
});
