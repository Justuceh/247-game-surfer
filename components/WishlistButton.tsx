import { useContext } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { WishlistContext } from '../store/context/wishlist/wishlist-context';
import WishlistGame from '../models/WishlistGame';

interface WishlistButtonProps {
	wishlistItem: WishlistGame; // Change this to WishlistItem
}

const WishlistButton = ({ wishlistItem }: WishlistButtonProps) => {
	const wishlistContext = useContext(WishlistContext);
	const isWishlisted = wishlistContext.games.some(
		(game) => game.id === wishlistItem.id
	);

	const changeWishlistStatusHandler = () => {
		if (isWishlisted) {
			wishlistContext.removeGame(wishlistItem.id);
		} else {
			wishlistContext.addGame(wishlistItem);
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
