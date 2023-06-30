import { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, Image } from 'react-native';
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
	const { data: gameList, isLoading: isGameLoading } = useQuery<any[], unknown>(
		[`gameName-${gameDealItem?.dealID}`],
		() => fetchGameData(gameQuery, 'games'),
		{ cacheTime: cacheTime }
	);

	const [filteredGame, setFilteredGame] = useState<any>(undefined);
	const [coverId, setCoverId] = useState<number | undefined>(undefined);
	const [videoIds, setVideoIds] = useState<number[] | undefined>(undefined);

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
			}
		}
	}, [gameList, gameDealItem]);

	// Second Query
	const { data: cover, isLoading: isCoverLoading } = useQuery<any, unknown>(
		[`coverId-${coverId}`],
		() => fetchGameData(queryById(coverId || 0), 'covers'),
		{
			cacheTime: cacheTime,
			enabled: coverId !== undefined,
		}
	);

	// Third Query
	const { data: videos, isLoading: isVideosLoading } = useQuery<any[], unknown>(
		[`videosId-${videoIds?.[0]}`],
		() => fetchGameData(queryByIds(videoIds || []), 'game_videos'),
		{
			cacheTime: cacheTime,
			enabled: videoIds !== undefined,
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
	return (
		<ModalComponent onClose={onClose} visible={showDetails}>
			{gameList !== null && gameList?.length ? (
				<View style={styles.rootContainer}>
					{isGameLoading ||
					isCoverLoading ||
					(isVideosLoading && videos !== undefined && videos > 0) ? (
						<ActivityIndicatorComponent color='white' size='large' />
					) : (
						<View style={{ flex: 1, alignItems: 'center' }}>
							<Image
								source={{
									uri: `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover?.[0]?.image_id}.jpg`,
								}}
								style={{ flex: 1, width: 300 }}
								resizeMode='contain'
							/>
							<Text
								style={{ color: 'white', flex: 1, justifyContent: 'center' }}>
								{filteredGame.name}
							</Text>
							{videos !== undefined ? (
								<View style={{ flex: 1, justifyContent: 'center' }}>
									<YouTubePlayer
										height={180}
										webViewStyle={{
											flex: 1,
											justifyContent: 'center',
											borderRadius: 10,
										}}
										videoId={videos?.[0].video_id}
									/>
								</View>
							) : (
								<></>
							)}
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
		backgroundColor: Colors.charcoalLight,
	},
});
