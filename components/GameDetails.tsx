import { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { IGDB_BASE_URL } from '@env';

import ModalComponent from './ModalComponent';
import Colors from '../constants/colors';
import GameDealItem from '../models/GameDealItem';
import { AuthContext } from '../store/context/auth/auth-context';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import ActivityIndicatorComponent from './ActivityIndicator';
import { findClosestString, removeEditionWords } from '../utils/stringUtils';
import Fonts from '../constants/fonts';
import PriceLabel from './PriceLabel';
import GameReviewScore from './GameReviewScore';
import IgdbGame from '../models/IgdbGame';
import IgdbCover from '../models/IgdbCover';
import IgdbVideo from '../models/IgdbVideo';
import IgdbScreenshots from '../models/IgdbScreenshot';
import GameText from './GameText';
import GameCover from './GameCover';
import ScreenShotViewer from './ScreenShotViewer';
import VideoViewer from './VideoViewer';
import ViewerImage from '../models/ViewerImage';
import GameDeal from '../models/GameDeal';

interface GameDetailsProps {
	gameDealItem: GameDealItem | undefined;
	showDetails: boolean;
	onClose: () => void;
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
	const [images, setImages] = useState<ViewerImage[] | undefined>(undefined);

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
	const isGameListEmpty = gameList === null || gameList?.length === 0;
	// Create a new Date object with the Unix timestamp in milliseconds
	const date = new Date(
		parseInt(filteredGame?.first_release_date || '', 10) * 1000
	);
	// Convert the date to a readable string
	const readableDate = date.toLocaleDateString();
	const gameDeal: GameDeal = {
		storeID: gameDealItem?.storeID,
		dealID: gameDealItem?.dealID,
		price: gameDealItem?.salePrice,
		retailPrice: gameDealItem?.normalPrice,
		savings: gameDealItem?.savings,
	};
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
									<View style={styles.gameInfoContainer}>
										<GameCover imageId={cover?.[0]?.image_id} />
										<PriceLabel game={gameDeal} />
										<GameReviewScore
											game={gameDealItem}
											releaseDate={readableDate}
										/>
										<GameText
											gameTitle={filteredGame?.name}
											gameSummary={filteredGame?.summary}
										/>
									</View>
								</ScrollView>
								{screenShots !== undefined && images !== undefined ? (
									<ScreenShotViewer screenShots={screenShots} images={images} />
								) : (
									<View>
										<Text>No Screenshots Available</Text>
									</View>
								)}
							</>

							{videos !== undefined ? (
								<VideoViewer videos={videos} />
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
									fontFamily: Fonts.itimFont,
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
	},
	activityIndicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	gameInfoContainer: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 5,
	},
});
