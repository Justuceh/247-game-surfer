import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import WishlistForm from '../components/WishListForm';
const WishListScreen: React.FC = () => {
	return (
		<View style={styles.rootContainer}>
			<WishlistForm />
		</View>
	);
};

export default WishListScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
