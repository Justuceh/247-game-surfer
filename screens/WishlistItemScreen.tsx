import { Text, View, StyleSheet } from 'react-native';

const WishlistItemScreen = () => {
	return (
		<View style={styles.rootContainer}>
			<Text style={styles.text}>Wishlist Item Screen!!</Text>
		</View>
	);
};

export default WishlistItemScreen;

const styles = StyleSheet.create({
	linearGradient: {
		flex: 1,
	},
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		flex: 1,
		justifyContent: 'center',
	},
});
