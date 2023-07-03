import { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { IGDB_BASE_URL } from '@env';

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
import PriceLabel from './PriceLabel';
import GameReviewScore from './GameReviewScore';

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
	first_release_date: string;
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

	const renderVideos = (video: IgdbVideo) => {
		return (
			<View key={video.id} style={styles.youTubeContainer}>
				<YouTubePlayer height={190} videoId={video.video_id} />
			</View>
		);
	};
	const isGameListEmpty = gameList === null || gameList?.length === 0;
	// Create a new Date object with the Unix timestamp in milliseconds
	const date = new Date(
		parseInt(filteredGame?.first_release_date || '', 10) * 1000
	);
	// Convert the date to a readable string
	const readableDate = date.toLocaleDateString();
	return (
		<ModalComponent onClose={onClose} visible={showDetails}>
			{!isGameListEmpty &&
			(isGameLoading ||
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
									<View style={styles.coverContainer}>
										<Image
											source={{
												uri: `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover?.[0]?.image_id}.jpg`,
											}}
											style={[styles.coverImage, { width: 300, height: 300 }]}
											resizeMode='contain'
										/>
										<PriceLabel game={gameDealItem} />
										<GameReviewScore
											game={gameDealItem}
											releaseDate={readableDate}
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
									<>
										<Text style={styles.containerText}>Screenshots</Text>
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
									</>
								) : (
									<View>
										<Text>No Screenshots Available</Text>
									</View>
								)}
							</>

							{videos !== undefined ? (
								<>
									<Text style={styles.containerText}>Videos</Text>
									<ScrollView>
										<View style={styles.videosContainer}>
											{videos.map((video) => {
												return renderVideos(video);
											})}
										</View>
									</ScrollView>
								</>
							) : (
								<View>
									<Text>No Videos Available</Text>
								</View>
							)}
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
									fontFamily: Fonts.gameTitleFont,
								}}>
								No game details available for {gameDealItem?.title}
							</Text>
						</View>
					)}
				</ScrollView>
			)}
		</ModalComponent>
	);
};

export default GameDetails;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.charcoalDark,
	},
	activityIndicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	coverContainer: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.charcoalDark,
		marginTop: 5,
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
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 15,
		fontFamily: Fonts.gameTitleFont,
	},
	picturesContainer: {
		flex: 1,
		flexDirection: 'row',
		borderTopWidth: 0.5,
		borderColor: 'red',
		marginBottom: 10,
		marginVertical: 5,
	},
	screenShotsContainer: { flex: 1, alignItems: 'center' },
	containerText: {
		color: Colors.offWhite,
		fontSize: 20,
		fontFamily: Fonts.gameTitleFont,
	},
	screenShot: {
		marginHorizontal: 3,
		height: 200,
		width: 250,
	},
	videosContainer: {
		flex: 1,
		borderTopWidth: 0.5,
		borderColor: 'red',
		marginBottom: 30,
		marginVertical: 5,
		paddingTop: 5,
	},
	youTubeContainer: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: Colors.charcoalDark,
		borderRadius: 10,
		padding: 10,
		margin: 5,
		elevation: 4,
		shadowColor: '#c7c7c7',
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 4,
		shadowOpacity: 0.5,
	},
});
