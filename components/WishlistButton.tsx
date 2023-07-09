import { useContext } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { WishlistContext } from '../store/context/wishlist/wishlist-context';
import GameDealItem from '../models/GameDealItem';

interface WishlistButtonProps {
	gameDealItem: GameDealItem;
}

const WishlistButton = ({ gameDealItem }: WishlistButtonProps) => {
	const wishlistContext = useContext(WishlistContext);
	const isWishlisted = wishlistContext.games.some(
		(game) => game.id === gameDealItem.gameID
	);

	const changeWishlistStatusHandler = () => {
		if (isWishlisted) {
			wishlistContext.removeGame(gameDealItem.gameID);
		} else {
			const wishlistGame = {
				id: gameDealItem.gameID,
				title: gameDealItem.title,
				thumb: gameDealItem.thumb,
			};
			wishlistContext.addGame(wishlistGame);
		}
	};

	return (
		<Pressable
			onPress={changeWishlistStatusHandler}
			style={({ pressed }) => [pressed ? styles.pressed : null]}>
			<Ionicons
				onPress={changeWishlistStatusHandler}
				name='ios-star'
				size={20}
				color={!isWishlisted ? '#a3a3a3' : '#02f402'}
			/>
		</Pressable>
	);
};

export default WishlistButton;

const styles = StyleSheet.create({
	pressed: {
		opacity: 0.5,
	},
});
