import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createStackNavigator } from '@react-navigation/stack';

import StoresScreen from './screens/StoresScreen';
import WishListScreen from './screens/WishListScreen';
import GamesScreen from './screens/GamesScreen';
import GameDealsScreen from './screens/GameDealsScreen';
import { WishlistContextProvider } from './store/context/wishlist/wishlist-context';
import { GameStoreContextProvider } from './store/context/game_deals/game-stores-context';

export type RootNavigatorParamList = {
	StoresScreen: undefined;
	StoresScreenStack: undefined;
	GameDealsScreen: { storeID: string };
	WishListScreen: undefined;
	GamesScreen: undefined;
};

//App level query client that is passed down to all child components
const queryClient = new QueryClient();
const Stack = createStackNavigator();

export default function App() {
	const Tab = createMaterialTopTabNavigator();
	const Stack = createStackNavigator<RootNavigatorParamList>();

	const StoresScreenTab = () => {
		return (
			<Stack.Navigator>
				<Stack.Screen name='StoresScreenStack' component={StoresScreen} />
				<Stack.Screen name='GameDealsScreen' component={GameDealsScreen} />
			</Stack.Navigator>
		);
	};

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.rootContainer}>
				<StatusBar style='auto' />
				<GameStoreContextProvider>
					<WishlistContextProvider>
						<NavigationContainer<RootNavigatorParamList>>
							<QueryClientProvider client={queryClient}>
								<Tab.Navigator>
									<Tab.Screen
										name='StoresScreen'
										component={StoresScreenTab}
										options={{ title: 'Stores' }}
									/>
									<Tab.Screen
										name='WishListScreen'
										options={{ title: 'Wish List' }}
										component={WishListScreen}
									/>
									<Tab.Screen
										name='GamesScreen'
										options={{ title: 'Games' }}
										component={GamesScreen}
									/>
								</Tab.Navigator>
							</QueryClientProvider>
						</NavigationContainer>
					</WishlistContextProvider>
				</GameStoreContextProvider>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
	},
});
