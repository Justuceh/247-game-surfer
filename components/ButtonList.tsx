import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import Fonts from '../constants/fonts';
import Colors from '../constants/colors';
import filterLabels from '../constants/string';

interface ButtonListProps {
	labels: string[];
	onPress: (label: string) => void;
	forceSelectLabel?: string;
}

const ButtonList = ({ labels, onPress, forceSelectLabel }: ButtonListProps) => {
	const [selectedButton, setSelectedButton] = useState('');
	useEffect(() => {
		const topDealsLabel = labels.find(
			(label) => label === filterLabels.topDeals
		);
		if (topDealsLabel) {
			setSelectedButton(topDealsLabel);
		}
	}, []);
	useEffect(() => {
		const forceSelectedLabel = labels.find(
			(label) => label === forceSelectLabel
		);
		if (forceSelectedLabel) {
			setSelectedButton(forceSelectedLabel);
		}
	}, [forceSelectLabel]);
	return (
		<ScrollView
			style={styles.scrollViewContainer}
			showsHorizontalScrollIndicator={false}
			horizontal={true}>
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
		borderRadius: 18,
		borderWidth: 1,
		marginHorizontal: 6,
	},
	buttonText: {
		fontFamily: Fonts.openSans_400Regular,
		fontSize: 15,
		color: 'white',
		paddingHorizontal: 10,
	},
});
