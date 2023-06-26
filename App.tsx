import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import {
	NavigationContainer,
	getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {
	MaterialTopTabBar,
	MaterialTopTabBarProps,
	createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, Itim_400Regular } from '@expo-google-fonts/dev';

import StoresScreen from './screens/StoresScreen';
import WishListScreen from './screens/WishListScreen';
import GamesScreen from './screens/GamesScreen';
import GameDealsScreen from './screens/GameDealsScreen';
import { WishlistContextProvider } from './store/context/wishlist/wishlist-context';
import { GameStoreContextProvider } from './store/context/game_deals/game-stores-context';
import AppLoading from 'expo-app-loading';
import Fonts from './constants/fonts';

export type RootNavigatorParamList = {
	StoresScreen: undefined;
	WishListScreen: undefined;
	GamesScreen: undefined;
	StoresScreenStack: undefined;
	GameDealsScreen: { storeID: string; title: string };
};

//App level query client that is passed down to all child components
const queryClient = new QueryClient();

export default function App() {
	const [fontLoaded] = useFonts({
		Itim_400Regular,
		// Add more font assignments here as required
	});

	if (!fontLoaded) {
		return <AppLoading />;
	}
	const Tab = createMaterialTopTabNavigator();
	const Stack = createStackNavigator<RootNavigatorParamList>();
	//TODO add logic for loading fonts behind the splash screen once I add a splash screen
	//TODO add splash screen

	const StoresScreenTab = () => {
		return (
			<Stack.Navigator>
				<Stack.Screen
					options={{ headerShown: false }}
					name='StoresScreen'
					component={StoresScreen}
				/>
				<Stack.Screen
					options={{ headerStatusBarHeight: 2, headerBackTitle: 'Stores' }}
					name='GameDealsScreen'
					component={GameDealsScreen}
				/>
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
								<Tab.Navigator
									tabBar={(props: MaterialTopTabBarProps) => {
										const { state } = props;
										const currentRoute = state.routes[state.index];
										const focusedRouteName =
											getFocusedRouteNameFromRoute(currentRoute);
										if (focusedRouteName === 'GameDealsScreen') {
											return null; // Hide the tab bar for specific screens with tabBarVisible set to false
										}

										return (
											<MaterialTopTabBar {...props} /> // Render the default tab bar otherwise
										);
									}}>
									<Tab.Screen
										name='StoresScreenMain'
										component={StoresScreenTab}
										options={{
											title: 'Store Deals',
											tabBarLabelStyle: styles.tabBarText,
										}}
									/>
									<Tab.Screen
										name='GamesScreen'
										options={{
											title: 'Game Search',
											tabBarLabelStyle: styles.tabBarText,
										}}
										component={GamesScreen}
									/>
									<Tab.Screen
										name='WishListScreen'
										options={{
											title: 'Wish List',
											tabBarLabelStyle: styles.tabBarText,
										}}
										component={WishListScreen}
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
	tabBarText: {
		fontFamily: Fonts.itim,
		fontSize: 15,
	},
});
