import { useContext } from 'react';
import { WishlistContext } from '../store/context/wishlist/wishlist-context';
import GameList from '../components/GameList';

const WishListScreen = () => {
	const wishListGames = useContext(WishlistContext);

	return <GameList games={wishListGames.games} />;
};

export default WishListScreen;
