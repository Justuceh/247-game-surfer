import { useContext } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { WishlistContext } from '../store/context/wishlist/wishlist-context';
import { GameDealItem } from '../screens/GameDealsScreen';

interface WishlistButtonProps {
	gameDealItem: GameDealItem;
}

const WishlistButton = ({ gameDealItem }: WishlistButtonProps) => {
	const wishlistContext = useContext(WishlistContext);
	const isWishlisted = wishlistContext.games.some(
		(game) => game.gameID === gameDealItem.gameID
	);

	const changeWishlistStatusHandler = () => {
		if (isWishlisted) {
			wishlistContext.removeGame(gameDealItem.gameID);
		} else {
			wishlistContext.addGame(gameDealItem);
		}
	};

	return (
		<Pressable
			onPress={changeWishlistStatusHandler}
			style={({ pressed }) => [pressed ? styles.pressed : null]}>
			<Icon
				onPress={changeWishlistStatusHandler}
				name={!isWishlisted ? 'playlist-add' : 'playlist-add-check'}
				size={30}
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
