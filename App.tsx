import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import StoresScreen from './screens/StoresScreen';
import GameDealsScreen, { GameDealsProps } from './screens/GameDealsScreen';
import WishListScreen from './screens/WishListScreen';
import GamessScreen from './screens/GamesScreen';
import { WishlistContextProvider } from './store/context/wishlist/wishlist-context';
import { GameStoreContextProvider } from './store/context/game_deals/game-stores-context';

type RootNavigatorParamList = {
	StoresScreen: undefined;
	GameDealsScreen: undefined;
	WishListScreen: undefined;
	GamesScreen: undefined;
};

//App level query client that is passed down to all child components
const queryClient = new QueryClient();

export default function App() {
	const Tab = createMaterialTopTabNavigator();

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
										component={StoresScreen}
										options={{ title: 'Stores' }}
									/>
									{/* <Tab.Screen
										name='GameDealsScreen'
										options={{ title: 'Deals' }}
										component={GameDealsScreen}
									/> */}
									<Tab.Screen
										name='WishListScreen'
										options={{ title: 'Wish List' }}
										component={WishListScreen}
									/>
									<Tab.Screen
										name='GamesScreen'
										options={{ title: 'Games' }}
										component={GamessScreen}
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
