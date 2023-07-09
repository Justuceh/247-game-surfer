import { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { CHEAPSHARK_API_URL, IGDB_BASE_URL } from '@env';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { RootNavigatorParamList } from '../App';
import { findClosestString, removeEditionWords } from '../utils/stringUtils';
import { AuthContext } from '../store/context/auth/auth-context';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import GameItem from '../models/GameItem';
import ViewerImage from '../models/ViewerImage';
import IgdbCover from '../models/IgdbCover';
import IgdbVideo from '../models/IgdbVideo';
import IgdbScreenshots from '../models/IgdbScreenshot';
import IgdbGame from '../models/IgdbGame';
import Filters from '../models/Filters';
import VideoViewer from '../components/VideoViewer';
import ScreenShotViewer from '../components/ScreenShotViewer';
import GameText from '../components/GameText';
import GameCover from '../components/GameCover';
import ActivityIndicatorComponent from '../components/ActivityIndicator';
import GameDeal from '../models/GameDeal';
import FavoritesPriceLabel from '../components/FavoritesPriceLabel';

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
	const { gameId, title } = route.params;

	useEffect(() => {
		navigation.setOptions({
			headerStyle: { backgroundColor: 'black' },
			headerTitleStyle: { fontFamily: Fonts.itimFont, fontSize: 20 },
			headerTintColor: Colors.offWhite,
		});
	}, []);

	async function fetchCheapSharkData(endpoint: string, params: Filters) {
		return await axios
			.get(`${CHEAPSHARK_API_URL}/${endpoint}`, { params })
			.then((response) => {
				if (!response) {
					throw new Error('Network response was not ok');
				}
				return response.data;
			})
			.catch((err) => err);
	}
	const { data: csGame, isLoading: csGameIsloading } = useQuery<
		GameItem,
		unknown
	>(
		[`csGame-${gameId}`],
		() =>
			fetchCheapSharkData('games', {
				id: gameId,
				pageNumber: 1,
			}),
		{
			cacheTime: Infinity,
		}
	);

	const authContext = useContext(AuthContext);
	const headers = authContext.getRequestHeaders();
	const cacheTime = Infinity;
	const plainGameTitle = removeEditionWords(title);

	const gameQuery = `
    fields id, cover, name, screenshots, summary, videos, first_release_date; 
    search "${plainGameTitle}"; 
    limit 20; 
  `;

	const queryById = (id: number) => {
		return `
      fields *;
      where id = ${id};
      limit 1;
    `;
	};
	const queryByIds = (ids: number[]) => {
		return `
      fields *;
      where id = (${[...ids]});
    `;
	};

	// First Query
	const { data: gameList, isLoading: isGameLoading } = useQuery<
		IgdbGame[],
		unknown
	>([`game-${gameId}`], () => fetchIgdbGameData(gameQuery, 'games'), {
		cacheTime: cacheTime,
	});

	const [filteredGame, setFilteredGame] = useState<IgdbGame | undefined>(
		undefined
	);
	const [coverId, setCoverId] = useState<number | undefined>(undefined);
	const [videoIds, setVideoIds] = useState<number[] | undefined>(undefined);
	const [screenShotIds, setScreenShotIds] = useState<number[] | undefined>(
		undefined
	);
	const [images, setImages] = useState<ViewerImage[] | undefined>(undefined);
	const [gameDeals, setGameDeals] = useState<GameDeal[] | undefined>(undefined);

	useEffect(() => {
		if (gameList) {
			const closestGameName = findClosestString(
				plainGameTitle,
				gameList?.map((game) => game.name) || []
			);
			const game = gameList?.find((game) => game.name == closestGameName);
			if (game) {
				setFilteredGame(game);
				navigation.setOptions({
					title: `${game.name}`,
				});
				if (game.cover) {
					setCoverId(game.cover);
				}
				if (game.videos) {
					setVideoIds(game.videos);
				}
				if (game.screenshots) {
					setScreenShotIds(game.screenshots);
				}
			}
		}
	}, [gameList, gameId]);

	useEffect(() => {
		if (csGame !== undefined) {
			setGameDeals(csGame?.deals);
		}
	}, [csGame]);

	// Second Query
	const { data: cover, isLoading: isCoverLoading } = useQuery<
		IgdbCover[],
		unknown
	>(
		[`coverId-${coverId}`],
		() => fetchIgdbGameData(queryById(coverId || 0), 'covers'),
		{
			cacheTime: cacheTime,
			enabled: coverId !== undefined,
		}
	);

	// Third Query
	const { data: videos, isLoading: isVideosLoading } = useQuery<
		IgdbVideo[],
		unknown
	>(
		[`videosId-${videoIds?.[0]}`],
		() => fetchIgdbGameData(queryByIds(videoIds || []), 'game_videos'),
		{
			cacheTime: cacheTime,
			enabled: videoIds !== undefined,
		}
	);

	// Fourth Query
	const { data: screenShots, isLoading: isScreenShotsLoading } = useQuery<
		IgdbScreenshots[],
		unknown
	>(
		[`screenShotsId-${videoIds?.[0]}`],
		() => fetchIgdbGameData(queryByIds(screenShotIds || []), 'screenshots'),
		{
			cacheTime: cacheTime,
			enabled: screenShotIds !== undefined,
		}
	);
	useEffect(() => {
		if (screenShots !== undefined) {
			const screenShotImages: ViewerImage[] = screenShots.map((screenShot) => {
				return {
					url: `https://images.igdb.com/igdb/image/upload/t_cover_big/${screenShot.image_id}.jpg`,
					height: screenShot.height,
					width: screenShot.width,
				};
			});
			setImages(screenShotImages);
		}
	}, [screenShots]);

	async function fetchIgdbGameData(query: string, endpoint: string) {
		try {
			const response = await axios.post(`${IGDB_BASE_URL}${endpoint}`, query, {
				headers: { ...headers, 'Content-Type': 'text/plain' },
			});
			return response.data;
		} catch (err) {
			console.log(err);
		}
	}
	const isGameListEmpty = gameList === null || gameList?.length === 0;
	const isCsGameListEmpty = csGame === undefined;
	// Create a new Date object with the Unix timestamp in milliseconds
	const date = new Date(
		parseInt(filteredGame?.first_release_date || '', 10) * 1000
	);
	// Convert the date to a readable string
	const readableDate = date.toLocaleDateString();

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
					{(!isGameListEmpty || !isCsGameListEmpty) &&
					(isGameLoading ||
						csGameIsloading ||
						isCoverLoading ||
						(isVideosLoading && videos !== undefined && videos > 0)) ? (
						<View style={styles.activityIndicator}>
							<ActivityIndicatorComponent color='white' size='large' />
						</View>
					) : (
						<ScrollView>
							{gameList !== null && gameList?.length ? (
								<View style={styles.rootContainer}>
									<>
										<ScrollView>
											<View style={styles.gameInfoContainer}>
												<GameCover imageId={cover?.[0]?.image_id} />
												{gameDeals !== undefined &&
													gameDeals?.map((deal) => {
														return <FavoritesPriceLabel gameDeal={deal} />;
													})}
												<GameText
													gameTitle={filteredGame?.name}
													gameSummary={filteredGame?.summary}
												/>
											</View>
										</ScrollView>
										{screenShots !== undefined && images !== undefined && (
											<ScreenShotViewer
												screenShots={screenShots}
												images={images}
											/>
										)}
									</>

									{videos !== undefined && <VideoViewer videos={videos} />}
								</View>
							) : (
								<View
									style={{
										flex: 1,
										alignItems: 'center',
										marginTop: 300,
									}}>
									<Text
										style={{
											color: Colors.offWhite,
											fontSize: 23,
											fontFamily: Fonts.itimFont,
										}}>
										No game details available for {filteredGame?.name}
									</Text>
								</View>
							)}
						</ScrollView>
					)}
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
		marginBottom: 10,
	},
	activityIndicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	gameInfoContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 5,
	},
});
