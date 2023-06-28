import { useContext } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { CHEAPSHARK_REDIRECT_API, IGDB_BASE_URL } from '@env';

import ModalComponent from './ModalComponent';
import Colors from '../constants/colors';
import { GameDealItem } from '../screens/GameDealsScreen';
import { AuthContext } from '../store/context/auth/auth-context';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

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

	async function fetchGames() {
		return await axios
			.post(`${IGDB_BASE_URL}games`, {}, { headers: headers })
			.then((response) => {
				if (!response) {
					throw new Error('Network response was not ok');
				}
				return response.data;
			})
			.catch((err) => err);
	}

	const {
		data: games,
		isLoading,
		refetch,
	} = useQuery<any, unknown>([`games`], fetchGames);

	const openBrowserAsync = async (dealID: string) => {
		await WebBrowser.openBrowserAsync(`${CHEAPSHARK_REDIRECT_API}${dealID}`);
	};
	return (
		<ModalComponent onClose={onClose} visible={showDetails}>
			<View style={styles.rootContainer}>
				<Text style={{ color: 'white' }}>{gameDealItem?.title}</Text>
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
