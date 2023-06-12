import { useContext } from 'react';
import {
	Text,
	View,
	StyleSheet,
	ImageBackground,
	FlatList,
} from 'react-native';
import { WishlistContext } from '../store/context/wishlist-context';

import Card from '../components/Card';
import { Game } from '../store/context/wishlist-context';

const WishListScreen = () => {
	const wishListGames = useContext(WishlistContext);
	const renderCards = ({ item }: { item: Game }) => {
		return (
			<Card color='#e4e4e4'>
				<View style={styles.innerCardContainer}>
					<ImageBackground
						style={styles.image}
						source={{ uri: `${item.background_image}` }}
					/>
					<Text style={styles.storeText}>{item.name}</Text>
					<Text style={styles.storeText}>
						Metacritic Score: {item.metacritic}
					</Text>
				</View>
			</Card>
		);
	};

	return (
		<View style={styles.rootContainer}>
			<FlatList
				data={wishListGames.games}
				renderItem={renderCards}
				contentContainerStyle={{ padding: 5 }}
				keyExtractor={(item) => `${item.id}`}
			/>
		</View>
	);
};

export default WishListScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#282828',
	},
	innerCardContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		flex: 9,
		aspectRatio: 1,
	},
	storeText: {
		flex: 1,
		marginTop: 9,
		fontWeight: '400',
		fontSize: 19,
		color: 'black',
	},
});
