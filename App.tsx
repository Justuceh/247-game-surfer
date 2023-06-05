import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import StoresScreen from './screens/StoresScreen';
import GameDealsScreen from './screens/GameDealsScreen';
import WishListScreen from './screens/WishListScreen';

type RootNavigatorParamList = {
	StoresScreen: undefined;
	GameDealsScreen: undefined;
	WishListScreen: undefined;
};

export default function App() {
	const Tab = createMaterialTopTabNavigator();

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.rootContainer}>
				<StatusBar style='auto' />
				<NavigationContainer<RootNavigatorParamList>>
					<Tab.Navigator>
						<Tab.Screen
							name='StoresScreen'
							component={StoresScreen}
							options={{ title: 'Stores' }}
						/>
						<Tab.Screen
							name='GameDealsScreen'
							options={{ title: 'Deals' }}
							component={GameDealsScreen}
						/>
						<Tab.Screen
							name='WishListScreen'
							options={{ title: 'Wish List' }}
							component={WishListScreen}
						/>
					</Tab.Navigator>
				</NavigationContainer>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
	},
});
