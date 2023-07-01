import React, { ReactNode, useRef, useState } from 'react';
import {
	View,
	Modal,
	StyleSheet,
	Pressable,
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
			</Animated.View>
		</Modal>
	);
};
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
	overlay: {
		flex: 10,
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: 'blue',
	},
	modalContainer: {
		padding: 5,
		marginTop: 50,
		elevation: 5,
		height: height,
		width: width,
		backgroundColor: Colors.charcoalLight,
		shadowColor: 'black',
		shadowOffset: { width: 4, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.5,
	},
	modalSliderContainer: {
		alignItems: 'flex-end',
		borderBottomColor: 'grey',
		borderBottomWidth: 0.2,
	},
});

export default ModalComponent;
