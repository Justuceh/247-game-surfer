import { Text, View, StyleSheet } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '../constants/colors';
import { useEffect } from 'react';
import { RootNavigatorParamList } from '../App';
import Fonts from '../constants/fonts';

type WishlistItemScreenRouteProp = RouteProp<
	RootNavigatorParamList,
	'WishlistItemScreen'
>;
type WishlistItemScreenNavigationProp = StackNavigationProp<
	RootNavigatorParamList,
	'WishlistItemScreen'
>;

type WishlistItemScreenProps = {
	route: WishlistItemScreenRouteProp;
};

const WishlistItemScreen = ({ route }: WishlistItemScreenProps) => {
	const navigation = useNavigation<WishlistItemScreenNavigationProp>();

	useEffect(() => {
		navigation.setOptions({
			title: `Favorite Game`,
			headerStyle: { backgroundColor: 'black' },
			headerTitleStyle: { fontFamily: Fonts.itimFont, fontSize: 20 },
			headerTintColor: Colors.offWhite,
		});
	}, []);

	return (
		<>
			<LinearGradient
				style={styles.linearGradient}
				colors={[
					Colors.linearGradient.topColor,
					Colors.linearGradient.middleColor,
					Colors.linearGradient.bottomColor,
				]}>
				<View style={styles.rootContainer}>
					<Text style={styles.text}>Wishlist Item Screen!!</Text>
				</View>
			</LinearGradient>
		</>
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
