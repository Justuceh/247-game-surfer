import { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';

interface Game {
	id: number;
	title: string;
	platform: string;
}

const WishlistForm = () => {
	const [title, setTitle] = useState('');
	const [platform, setPlatform] = useState('');
	const [wishlist, setWishlist] = useState<Game[]>([]);

	const handleAddGame = () => {
		if (title.trim() === '' || platform.trim() === '') {
			return;
		}

		const newGame: Game = {
			id: Math.random(),
			title: title.trim(),
			platform: platform.trim(),
		};

		setWishlist((prevWishlist) => [...prevWishlist, newGame]);
		setTitle('');
		setPlatform('');
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder='Game Title'
				value={title}
				onChangeText={setTitle}
			/>
			<TextInput
				style={styles.input}
				placeholder='Platform'
				value={platform}
				onChangeText={setPlatform}
			/>
			<Button title='Add to Wishlist' onPress={handleAddGame} />
			{wishlist.map((game) => (
				<View key={game.id} style={styles.gameItem}>
					<Text>{game.title}</Text>
					<Text>{game.platform}</Text>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	input: {
		marginBottom: 12,
		padding: 8,
		borderWidth: 1,
		borderColor: 'gray',
		borderRadius: 4,
	},
	gameItem: {
		marginBottom: 8,
	},
});

export default WishlistForm;
