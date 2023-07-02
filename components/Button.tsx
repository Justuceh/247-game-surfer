import { Text, View, StyleSheet, Pressable } from 'react-native';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

interface ButtonProps {
	label: string;
	onPress: (label: string) => void;
	selected: boolean;
}

const Button = ({ label, onPress, selected }: ButtonProps) => {
	return (
		<View style={styles.rootContainer}>
			<Pressable
				onPress={() => onPress(label)}
				style={selected ? styles.pressed : styles.notPressed}>
				<Text style={styles.text}>{label}</Text>
			</Pressable>
		</View>
	);
};

export default Button;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		borderWidth: 1,
		margin: 10,
		backgroundColor: Colors.charcoalDark,
	},
	Pressable: {
		padding: 15,
		margin: 15,
	},
	pressed: {
		opacity: 1,
	},
	notPressed: {
		opacity: 0.5,
	},
	text: {
		fontFamily: Fonts.gameTitleFont,
		fontSize: 18,
		color: 'white',
		paddingHorizontal: 10,
	},
});
