import React, { ReactNode, useRef, useState } from 'react';
import {
	View,
	Modal,
	StyleSheet,
	Pressable,
	PanResponder,
	Animated,
	Dimensions,
} from 'react-native';
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
	const pan = useRef(new Animated.ValueXY()).current;

	function closeModal() {
		setShowModal(false);
		onClose();
	}

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (_, gestureState) => {
				pan.setValue({ x: 0, y: gestureState.dy });
			},
			onPanResponderRelease: (_, gestureState) => {
				if (gestureState.dy > 50 || gestureState.dy < 0) {
					Animated.timing(pan, {
						toValue: { x: 0, y: Dimensions.get('window').height },
						duration: 300, // adjust duration as needed
						useNativeDriver: true,
					}).start(() => {
						closeModal();
						pan.setValue({ x: 0, y: 0 }); // reset pan values for next opening of the modal
					});
				} else {
					Animated.spring(pan, {
						toValue: { x: 0, y: 0 },
						useNativeDriver: true,
					}).start();
				}
			},
		})
	).current;

	const animatedStyle = {
		transform: pan.getTranslateTransform(),
	};

	if (!showModal) {
		return null;
	}

	return (
		<Modal animationType='slide' transparent visible={showModal}>
			<Pressable style={styles.overlay} onPress={closeModal}>
				<Animated.View
					style={[styles.modalContainer, animatedStyle]}
					{...panResponder.panHandlers}>
					<View style={styles.modalSliderContainer}>
						<View style={styles.modalArrowSection}>
							<Ionicons name='md-chevron-up' size={15} color='#c1c1c1' />
							<Ionicons name='md-chevron-down' size={15} color='#c1c1c1' />
						</View>
						<Pressable
							onPress={closeModal}
							style={({ pressed }) => [
								{
									opacity: pressed ? 0.3 : 1,
								},
							]}>
							<Ionicons name='ios-close' size={22} color='#c1c1c1' />
						</Pressable>
					</View>

					{children}
				</Animated.View>
			</Pressable>
		</Modal>
	);
};
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	modalContainer: {
		padding: 16,
		borderRadius: 20,
		elevation: 5,
		marginBottom: 34,
		height: height / 1.17,
		width: width / 1.05,
		backgroundColor: Colors.charcoalLight,
		shadowColor: 'black',
		shadowOffset: { width: 4, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.5,
	},
	modalSliderContainer: {
		flexDirection: 'row',
		borderColor: 'grey',
		borderBottomWidth: 0.2,
	},
	modalArrowSection: {
		flex: 1,
		marginLeft: '9%',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default ModalComponent;
