import { useCallback } from 'react';
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
import { useFonts, Itim_400Regular } from '@expo-google-fonts/itim';
import { YatraOne_400Regular } from '@expo-google-fonts/yatra-one';
import { Righteous_400Regular } from '@expo-google-fonts/righteous';
import * as SplashScreen from 'expo-splash-screen';

import StoresScreen from './screens/StoresScreen';
import WishListScreen from './screens/WishListScreen';
import GamesScreen from './screens/GamesScreen';
import GameDealsScreen from './screens/GameDealsScreen';
import { WishlistContextProvider } from './store/context/wishlist/wishlist-context';
import { GameStoreContextProvider } from './store/context/game_deals/game-stores-context';
import Fonts from './constants/fonts';
import Colors from './constants/colors';
import { AuthProvider } from './store/context/auth/auth-context';

export type RootNavigatorParamList = {
	StoresScreen: undefined;
	WishListScreen: undefined;
	GamesScreen: undefined;
	StoresScreenStack: undefined;
	GameDealsScreen: { storeID: string; title: string };
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

//App level query client that is passed down to all child components
const queryClient = new QueryClient();

export default function App() {
	let [fontsLoaded] = useFonts({
		YatraOne_400Regular,
		Itim_400Regular,
		Righteous_400Regular,
	});

	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		return null;
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
			<SafeAreaView style={styles.rootContainer} onLayout={onLayoutRootView}>
				<StatusBar style='auto' />
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<GameStoreContextProvider>
							<WishlistContextProvider>
								<NavigationContainer<RootNavigatorParamList>>
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
										}}
										screenOptions={{
											tabBarStyle: { backgroundColor: Colors.charcoalDark },
											tabBarLabelStyle: styles.tabBarText,
											tabBarActiveTintColor: 'white',
											tabBarInactiveTintColor: '#a9a6a6',
											tabBarIndicatorStyle: {
												backgroundColor: 'white',
												opacity: 0.7,
											},
										}}>
										<Tab.Screen
											name='StoresScreenMain'
											component={StoresScreenTab}
											options={{
												title: 'Store Deals',
											}}
										/>
										<Tab.Screen
											name='GamesScreen'
											options={{
												title: 'Game Search',
											}}
											component={GamesScreen}
										/>
										<Tab.Screen
											name='WishListScreen'
											options={{
												title: 'Wish List',
											}}
											component={WishListScreen}
										/>
									</Tab.Navigator>
								</NavigationContainer>
							</WishlistContextProvider>
						</GameStoreContextProvider>
					</AuthProvider>
				</QueryClientProvider>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
	},
	tabBarText: {
		fontFamily: Fonts.tabBarFont,
		fontSize: 15,
	},
});
