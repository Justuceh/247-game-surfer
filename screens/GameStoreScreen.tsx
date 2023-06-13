import { useLayoutEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootNavigatorParamList } from '../App';

type GameStoreScreenRouteProp = RouteProp<
	RootNavigatorParamList,
	'GameStoreScreen'
>;
type GameStoreScreenNavigationProp = StackNavigationProp<
	RootNavigatorParamList,
	'GameStoreScreen'
>;

type GameStoreScreenProps = {
	route: GameStoreScreenRouteProp;
};

const GameStoreScreen = ({ route }: GameStoreScreenProps) => {
	const navigation = useNavigation<GameStoreScreenNavigationProp>();
	const { dealID, title } = route.params;

	useLayoutEffect(() => {
		navigation.setOptions({
			title: title,
			headerStyle: { backgroundColor: 'black' },
			headerTintColor: 'white',
		});
	}, [navigation, route]);

	return (
		<View style={styles.rootContainer}>
			<Text>Game Store Screen!</Text>
		</View>
	);
};

export default GameStoreScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
