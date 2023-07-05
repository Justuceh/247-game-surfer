import { useState } from 'react';
import { Text, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import Fonts from '../constants/fonts';
import Colors from '../constants/colors';

interface ButtonListProps {
	labels: string[];
	onPress: (label: string) => void;
}

const ButtonList = ({ labels, onPress }: ButtonListProps) => {
	const [selectedButton, setSelectedButton] = useState('');
	return (
		<ScrollView style={styles.scrollViewContainer} horizontal={true}>
			{labels.map((label) => {
				const isSelected = label === selectedButton;
				return (
					<View
						key={label}
						style={[
							styles.buttonContainer,
							{
								backgroundColor: isSelected
									? Colors.offWhite
									: Colors.charcoalDark,
							},
						]}>
						<Pressable
							onPress={() => {
								onPress(label);
								setSelectedButton(label);
							}}>
							<Text
								style={[
									styles.buttonText,
									{
										color: isSelected ? Colors.charcoalDark : Colors.offWhite,
									},
								]}>
								{label}
							</Text>
						</Pressable>
					</View>
				);
			})}
		</ScrollView>
	);
};

export default ButtonList;

const styles = StyleSheet.create({
	rootContainer: {},
	scrollViewContainer: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		borderWidth: 1,
		margin: 10,
		backgroundColor: Colors.charcoalDark,
	},
	buttonText: {
		fontFamily: Fonts.gameTitleFont,
		fontSize: 18,
		color: 'white',
		paddingHorizontal: 10,
	},
});