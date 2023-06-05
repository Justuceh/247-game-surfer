import { Text, View, StyleSheet } from 'react-native';

const GameDealsScreen = () => {
	return (
		<View style={styles.rootContainer}>
			<Text>Game Deals Screen!</Text>
		</View>
	);
};

export default GameDealsScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
