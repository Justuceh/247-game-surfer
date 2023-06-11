import { View, StyleSheet, Text } from 'react-native';

import SearchInput from '../components/SearchInput';
import ActivityIndicatorComponent from '../components/ActivityIndicator';

const GameDealsScreen = () => {
	function onGameDealSearchHandler() {
		console.log('searched game deals');
	}

	function handleOnChangeText(text: string) {
		console.log(text);
	}

	return (
		<View style={styles.rootContainer}>
			<View style={styles.searchContainer}>
				<SearchInput
					onChangeText={handleOnChangeText}
					onSearchHandler={onGameDealSearchHandler}
				/>
			</View>

			<View style={styles.dealsContainer}></View>
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
