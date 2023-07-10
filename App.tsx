import { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, OpenSans_400Regular } from '@expo-google-fonts/open-sans';
import * as SplashScreen from 'expo-splash-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

import StoresScreen from './screens/StoresScreen';
import GamesScreen from './screens/GamesScreen';
import GameDealsScreen from './screens/GameDealsScreen';
import WishlistScreen from './screens/WishlistScreen';
import WishlistItemScreen from './screens/WishlistItemScreen';
import { WishlistContextProvider } from './store/context/wishlist/wishlist-context';
import { GameStoreContextProvider } from './store/context/game_deals/game-stores-context';
import Colors from './constants/colors';
import { AuthProvider } from './store/context/auth/auth-context';
import { TutorialContextProvider } from './store/context/tutorial/tutorial-context';

export type RootNavigatorParamList = {
	StoresScreen: undefined;
	WishlistScreen: undefined;
	WishlistItemScreen: {
		gameId: string;
		title: string;
	};
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
		OpenSans_400Regular,
	});

	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		return null;
	}
	const Tab = createBottomTabNavigator();
	const Stack = createStackNavigator<RootNavigatorParamList>();

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

	const WishlistScreenTab = () => {
		return (
			<Stack.Navigator>
				<Stack.Screen
					options={{ headerShown: false }}
					name='WishlistScreen'
					component={WishlistScreen}
				/>
				<Stack.Screen
					options={{ headerStatusBarHeight: 2, headerBackTitle: 'Favorites' }}
					name='WishlistItemScreen'
					component={WishlistItemScreen}
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
								<TutorialContextProvider>
									<NavigationContainer<RootNavigatorParamList>>
										<Tab.Navigator
											screenOptions={{
												tabBarShowLabel: false,
												headerShown: false,
												tabBarStyle: {
													backgroundColor: Colors.charcoalLight,
													height: 50,
													paddingBottom: 10,
												},
												tabBarIconStyle: { marginTop: 10 },
												tabBarActiveTintColor: 'white',
												tabBarInactiveTintColor: '#918e8e',
											}}>
											<Tab.Screen
												name='StoresScreenMain'
												component={StoresScreenTab}
												options={{
													tabBarIcon: ({ color, size }) => (
														<Ionicons
															name='home-sharp'
															color={color}
															size={size}
														/>
													),
													tabBarIconStyle: { marginTop: 10 },
												}}
											/>
											<Tab.Screen
												name='GamesScreen'
												options={{
													tabBarIcon: ({ color, size }) => (
														<Ionicons
															name='search-sharp'
															color={color}
															size={size}
														/>
													),
												}}
												component={GamesScreen}
											/>
											<Tab.Screen
												name='WishListScreenMain'
												options={{
													tabBarIcon: ({ color, size }) => (
														<Ionicons
															name='ios-star'
															color={color}
															size={size}
														/>
													),
												}}
												component={WishlistScreenTab}
											/>
										</Tab.Navigator>
									</NavigationContainer>
								</TutorialContextProvider>
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
});
