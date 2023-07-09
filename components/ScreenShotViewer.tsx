import { useState } from 'react';
import {
	Text,
	View,
	StyleSheet,
	Modal,
	ScrollView,
	Pressable,
	Image,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import IgdbScreenshots from '../models/IgdbScreenshot';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import ViewerImage from '../models/ViewerImage';

interface ScreenShotViewerProps {
	screenShots: IgdbScreenshots[];
	images: ViewerImage[];
}

const ScreenShotViewer = ({ screenShots, images }: ScreenShotViewerProps) => {
	const [showScreenShotModal, setShowScreenShotModal] =
		useState<boolean>(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState<
		number | undefined
	>(undefined);
	function handleScreenShotPress(screenShotIndex: number) {
		setSelectedImageIndex(screenShotIndex);
		setShowScreenShotModal(true);
	}
	function closeModal() {
		setShowScreenShotModal(false);
	}
	return (
		<>
			<Text style={styles.containerText}>Screenshots</Text>
			<ScrollView horizontal={true}>
				<View style={styles.picturesContainer}>
					{screenShots.map((screenShot) => {
						const index = screenShots.indexOf(screenShot);
						return (
							<Pressable
								key={screenShot.id}
								onPress={() => handleScreenShotPress(index)}>
								<Image
									source={{
										uri: `https://images.igdb.com/igdb/image/upload/t_cover_big/${screenShot.image_id}.png`,
									}}
									style={styles.screenShot}
									resizeMode='contain'
								/>
							</Pressable>
						);
					})}
				</View>
			</ScrollView>
			<Modal visible={showScreenShotModal} transparent>
				<ImageViewer
					enableSwipeDown={true}
					onClick={closeModal}
					onSwipeDown={closeModal}
					swipeDownThreshold={100}
					enableImageZoom={true}
					index={selectedImageIndex}
					imageUrls={images.map((image) => ({
						url: image.url,
						height: image.height,
						width: image.width,
					}))}
				/>
			</Modal>
		</>
	);
};

export default ScreenShotViewer;

const styles = StyleSheet.create({
	picturesContainer: {
		flexDirection: 'row',
		borderTopWidth: 0.5,
		borderColor: 'red',
		padding: 5,
	},
	containerText: {
		color: Colors.offWhite,
		fontSize: 20,
		fontFamily: Fonts.itimFont,
		marginBottom: 4,
	},
	screenShot: {
		marginHorizontal: 5,
		height: 150,
		width: 250,
	},
});
