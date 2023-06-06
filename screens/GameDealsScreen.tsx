import { View, StyleSheet, Text } from 'react-native';

import SearchInput from '../components/SearchInput';

const GameDealsScreen = () => {
	function onGameDealSearchHandler() {
		console.log('searched game deals');
	}

	return (
		<View style={styles.rootContainer}>
			<View style={styles.searchContainer}>
				<SearchInput onSearchHandler={onGameDealSearchHandler} />
			</View>

			<View style={styles.dealsContainer}>
				<Text>Test</Text>
			</View>
		</View>
	);
};

export default GameDealsScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
	},
	searchContainer: {
		flex: 1,
	},
	dealsContainer: {
		flex: 9,
		margin: 10,
	},
});
