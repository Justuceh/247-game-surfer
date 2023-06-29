import { useContext } from 'react';
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

	// First Query
	const { data: game, isLoading: isGameLoading } = useQuery<any, unknown>(
		[`gameName-${gameDealItem?.title.replace(/\s+/g, '')}`],
		() => fetchGameData(gameQuery, 'games')
	);

	// Second Query, only if game is loaded and has a cover id
	const { data: cover, isLoading: isCoverLoading } = useQuery<any, unknown>(
		[`coverId-${game?.[0]?.cover}`, game?.[0]?.cover],
		() => fetchGameData(queryById(game?.[0]?.cover), 'covers'),
		{ enabled: !isGameLoading }
	);

	const gameQuery = `
		fields *; 
		search "${gameDealItem?.title}"; 
		limit 1; 
	`;

	const queryById = (id: number) => {
		return `
			fields *;
			where id = ${id};
			limit 1;
		`;
	};

	async function fetchGameData(query: string, endpoint: string) {
		return await axios
			.post(`${IGDB_BASE_URL}${endpoint}`, query, {
				headers: { ...headers, 'Content-Type': 'text/plain' },
			})
			.then((response) => {
				if (!response) {
					throw new Error('Network response was not ok');
				}
				return response.data;
			})
			.catch((err) => console.log(err));
	}

	const openBrowserAsync = async (dealID: string) => {
		await WebBrowser.openBrowserAsync(`${CHEAPSHARK_REDIRECT_API}${dealID}`);
	};
	return (
		<ModalComponent onClose={onClose} visible={showDetails}>
			<View style={styles.rootContainer}>
				{isGameLoading || isCoverLoading ? (
					<ActivityIndicatorComponent color='white' size='large' />
				) : (
					<View style={{ flex: 1 }}>
						<Image
							source={{
								uri: `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover?.[0]?.image_id}.jpg`,
							}}
							style={{ flex: 1, width: 300 }}
							resizeMode='contain'
						/>
						<Text style={{ color: 'white', flex: 1 }}>{game?.[0]?.name}</Text>
					</View>
				)}
			</View>
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
