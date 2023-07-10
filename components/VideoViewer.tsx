import { Text, View, StyleSheet, ScrollView } from 'react-native';

import IgdbVideo from '../models/IgdbVideo';
import YouTubePlayer from './YouTubePlayer';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

interface VideoViewerProps {
	videos: IgdbVideo[];
}

const VideoViewer = ({ videos }: VideoViewerProps) => {
	const renderVideos = (video: IgdbVideo) => {
		return (
			<View key={video.id} style={styles.youTubeContainer}>
				<YouTubePlayer height={190} videoId={video.video_id} />
			</View>
		);
	};

	return (
		<>
			<Text style={styles.containerText}>Videos</Text>
			<ScrollView>
				<View style={styles.videosContainer}>
					{videos.map((video) => {
						return renderVideos(video);
					})}
				</View>
			</ScrollView>
		</>
	);
};

export default VideoViewer;

const styles = StyleSheet.create({
	containerText: {
		color: Colors.offWhite,
		fontSize: 20,
		fontFamily: Fonts.openSans_400Regular,
	},
	videosContainer: {
		flex: 1,
		borderTopWidth: 0.5,
		borderColor: 'red',
		marginBottom: 30,
		marginVertical: 5,
		paddingTop: 5,
	},
	youTubeContainer: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: Colors.charcoalDark,
		borderRadius: 10,
		padding: 10,
		margin: 5,
		elevation: 4,
		shadowColor: '#c7c7c7',
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 4,
		shadowOpacity: 0.5,
	},
});
