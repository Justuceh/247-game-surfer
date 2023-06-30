import React from 'react';
import { StyleSheet, View } from 'react-native';
import YouTube, { YoutubeIframeProps } from 'react-native-youtube-iframe';

interface YouTubePlayerProps extends YoutubeIframeProps {
	videoId: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, ...props }) => {
	return (
		<View style={styles.container}>
			<YouTube videoId={videoId} {...props} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		aspectRatio: 16 / 9,
		marginTop: 20,
	},
});

export default YouTubePlayer;
