import { createContext } from 'react';

const WishlistContext = createContext({
	id: null,
	slug: '',
	name: '',
	description: '',
	backgroundImageUrl: '',
	releaseDate: '',
	metacritic: null,
	website: '',
	redditUrl: '',
});
