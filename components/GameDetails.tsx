import { useContext, useEffect, useState } from 'react';
import {
	Text,
	View,
	StyleSheet,
	Dimensions,
	Image,
	ScrollView,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { CHEAPSHARK_REDIRECT_API, IGDB_BASE_URL } from '@env';

import ModalComponent from './ModalComponent';
import Colors from '../constants/colors';
import { GameDealItem } from '../screens/GameDealsScreen';
import { AuthContext } from '../store/context/auth/auth-context';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import ActivityIndicatorComponent from './ActivityIndicator';
import { findClosestString, removeEditionWords } from '../utils/stringUtils';
import YouTubePlayer from './YouTubePlayer';
import Fonts from '../constants/fonts';

interface GameDetailsProps {
	gameDealItem: GameDealItem | undefined;
	showDetails: boolean;
	onClose: () => void;
}

interface IgdbGame {
	id: number;
	cover: number;
	name: string;
	screenshots: number[];
	summary: string;
	videos: number[];
}

interface IgdbCover {
	id: number;
	height: number;
	width: number;
	game: number;
	image_id: number;
	url: string;
}

interface IgdbVideo {
	id: number;
	game: number;
	name: string;
	video_id: string;
}

interface IgdbScreenshots {
	id: number;
	height: number;
	width: number;
	image_id: number;
	url: string;
}

const GameDetails = ({
	gameDealItem,
	showDetails,
	onClose,
}: GameDetailsProps) => {
	const authContext = useContext(AuthContext);
	const headers = authContext.getRequestHeaders();
	const cacheTime = Infinity;
	const plainGameTitle = removeEditionWords(gameDealItem?.title);
	const gameQuery = `
    fields *; 
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
	>(
		[`gameName-${gameDealItem?.dealID}`],
		() => fetchGameData(gameQuery, 'games'),
		{ cacheTime: cacheTime }
	);

	const [filteredGame, setFilteredGame] = useState<IgdbGame | undefined>(
		undefined
	);
	const [coverId, setCoverId] = useState<number | undefined>(undefined);
	const [videoIds, setVideoIds] = useState<number[] | undefined>(undefined);
	const [screenShotIds, setScreenShotIds] = useState<number[] | undefined>(
		undefined
	);

	useEffect(() => {
		if (gameList) {
			const closestGameName = findClosestString(
				plainGameTitle,
				gameList?.map((game) => game.name) || []
			);
			const game = gameList?.find((game) => game.name == closestGameName);
			if (game) {
				setFilteredGame(game);
				setCoverId(game.cover);
				if (game.videos) {
					setVideoIds(game.videos);
				}
				if (game.screenshots) {
					setScreenShotIds(game.screenshots);
				}
			}
		}
	}, [gameList, gameDealItem]);

	// Second Query
	const { data: cover, isLoading: isCoverLoading } = useQuery<
		IgdbCover[],
		unknown
	>(
		[`coverId-${coverId}`],
		() => fetchGameData(queryById(coverId || 0), 'covers'),
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
		() => fetchGameData(queryByIds(videoIds || []), 'game_videos'),
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
		() => fetchGameData(queryByIds(screenShotIds || []), 'screenshots'),
		{
			cacheTime: cacheTime,
			enabled: screenShotIds !== undefined,
		}
	);

	async function fetchGameData(query: string, endpoint: string) {
		try {
			const response = await axios.post(`${IGDB_BASE_URL}${endpoint}`, query, {
				headers: { ...headers, 'Content-Type': 'text/plain' },
			});
			return response.data;
		} catch (err) {
			console.log(err);
		}
	}

	const openBrowserAsync = async (dealID: string) => {
		await WebBrowser.openBrowserAsync(`${CHEAPSHARK_REDIRECT_API}${dealID}`);
	};

	const renderVideos = (video: IgdbVideo) => {
		return (
			<View key={video.id} style={styles.youTubeContainer}>
				<YouTubePlayer
					height={180}
					webViewStyle={{
						flex: 1,
						margin: 7,
					}}
					videoId={video.video_id}
				/>
			</View>
		);
	};

	return (
		<ModalComponent onClose={onClose} visible={showDetails}>
			<ScrollView>
				{gameList !== null && gameList?.length ? (
					<View style={styles.rootContainer}>
						{isGameLoading ||
						isCoverLoading ||
						(isVideosLoading && videos !== undefined && videos > 0) ? (
							<ActivityIndicatorComponent color='white' size='large' />
						) : (
							<>
								<ScrollView>
									<View style={styles.coverContainer}>
										<Image
											source={{
												uri: `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover?.[0]?.image_id}.jpg`,
											}}
											style={[styles.coverImage, { width: 300, height: 300 }]}
											resizeMode='contain'
										/>
										<View style={styles.labelTextContainer}>
											<Text style={styles.labelText}>{filteredGame?.name}</Text>
											<View style={styles.summaryContainerText}>
												<Text style={styles.summaryText}>
													{filteredGame?.summary}
												</Text>
											</View>
										</View>
									</View>
								</ScrollView>
								{screenShots !== undefined ? (
									<ScrollView horizontal={true}>
										<View style={styles.picturesContainer}>
											{screenShots.map((screenShot) => {
												return (
													<View
														style={styles.screenShotsContainer}
														key={screenShot.id}>
														<Image
															source={{
																uri: `https://images.igdb.com/igdb/image/upload/t_cover_big/${screenShot.image_id}.jpg`,
															}}
															style={styles.screenShot}
															resizeMode='contain'
														/>
													</View>
												);
											})}
										</View>
									</ScrollView>
								) : (
									<View>
										<Text>No Videos Available</Text>
									</View>
								)}
							</>
						)}

						{videos !== undefined ? (
							<ScrollView>
								<View style={styles.videosContainer}>
									{videos.map((video) => {
										return renderVideos(video);
									})}
								</View>
							</ScrollView>
						) : (
							<View>
								<Text>No Videos Available</Text>
							</View>
						)}
					</View>
				) : (
					<View
						style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ color: 'white' }}>
							No game data available for {gameDealItem?.title}
						</Text>
					</View>
				)}
			</ScrollView>
		</ModalComponent>
	);
};

export default GameDetails;

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.charcoalDark,
	},
	coverContainer: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.charcoalDark,
	},
	coverImage: {
		flex: 2,
		width: 200,
	},
	labelTextContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		margin: 20,
	},
	labelText: {
		color: 'white',
		fontSize: 25,
		fontWeight: 'bold',
		fontFamily: Fonts.gameTitleFont,
		flex: 1,
		justifyContent: 'center',
		marginTop: 15,
		alignItems: 'center',
	},
	summaryContainerText: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	summaryText: {
		flex: 1,
		color: 'white',
		fontSize: 15,
		fontWeight: 'bold',
		marginTop: 15,
		fontFamily: Fonts.gameTitleFont,
	},
	picturesContainer: {
		flex: 1,
		flexDirection: 'row',
		borderTopWidth: 2,
		borderColor: Colors.offWhite,
		marginBottom: 30,
		marginVertical: 20,
	},
	screenShotsContainer: { flex: 1, alignItems: 'center' },
	screenShot: {
		marginHorizontal: 3,
		height: 200,
		width: 250,
	},
	videosContainer: {
		flex: 1,
		borderTopWidth: 2,
		borderColor: Colors.offWhite,
		marginBottom: 30,
		marginVertical: 10,
	},
	youTubeContainer: { flex: 1, alignItems: 'center' },
});
