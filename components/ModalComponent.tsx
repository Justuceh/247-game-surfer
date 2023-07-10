import React, { ReactNode, useRef, useState } from 'react';
import {
	View,
	Modal,
	StyleSheet,
	Pressable,
	Animated,
	Dimensions,
	StatusBar,
	Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../constants/colors';

interface ModalComponentProps {
	visible: boolean;
	onClose: () => void;
	children: ReactNode;
}

const ModalComponent = ({
	visible,
	onClose,
	children,
}: ModalComponentProps) => {
	const [showModal, setShowModal] = useState(visible || false);

	function closeModal() {
		setShowModal(false);
		onClose();
	}

	if (!showModal) {
		return null;
	}

	return (
		<Modal animationType='slide' visible={showModal}>
			<Animated.View style={styles.modalContainer}>
				<LinearGradient
					style={styles.linearGradient}
					colors={[
						Colors.charcoal,
						Colors.linearGradient.middleColor,
						Colors.linearGradient.bottomColor,
					]}>
					<View style={styles.modalSliderContainer}>
						<Pressable
							onPress={closeModal}
							style={({ pressed }) => [
								{
									opacity: pressed ? 0.3 : 1,
								},
							]}>
							<Ionicons name='close-circle-outline' size={35} color='#c1c1c1' />
						</Pressable>
					</View>

					{children}
				</LinearGradient>
			</Animated.View>
		</Modal>
	);
};
const { height, width } = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight || 50;
const styles = StyleSheet.create({
	linearGradient: {
		flex: 1,
	},
	overlay: {
		flex: 10,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	modalContainer: {
		flex: 1,
		marginTop: Platform.OS === 'ios' ? statusBarHeight : 0,
		height: height,
		width: width,
	},
	modalSliderContainer: {
		alignItems: 'flex-end',
		borderBottomColor: 'red',
		marginBottom: 5,
		borderBottomWidth: 0.5,
		paddingBottom: 3,
	},
});

export default ModalComponent;
