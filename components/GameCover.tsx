import { Image, StyleSheet } from 'react-native';

interface GameCoverProps {
	imageId: number | undefined;
}

const GameCover = ({ imageId }: GameCoverProps) => {
	return (
		<Image
			source={{
				uri: `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`,
			}}
			style={[styles.coverImage, { width: 300, height: 300 }]}
			resizeMode='contain'
		/>
	);
};

export default GameCover;

const styles = StyleSheet.create({
	coverImage: {
		flex: 2,
		width: 200,
	},
});
