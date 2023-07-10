import { View, Text, StyleSheet } from 'react-native';

import Fonts from '../constants/fonts';

interface GameTextProps {
	gameTitle: string | undefined;
	gameSummary: string | undefined;
}

const GameText = ({ gameTitle, gameSummary }: GameTextProps) => {
	return (
		<View style={styles.labelTextContainer}>
			<Text style={styles.labelText}>{gameTitle}</Text>
			<View style={styles.summaryContainerText}>
				<Text style={styles.summaryText}>{gameSummary}</Text>
			</View>
		</View>
	);
};

export default GameText;

const styles = StyleSheet.create({
	labelTextContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		margin: 20,
	},
	labelText: {
		color: 'white',
		fontSize: 25,
		fontWeight: '600',
		fontFamily: Fonts.openSans_400Regular,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	summaryContainerText: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	summaryText: {
		flex: 1,
		color: 'white',
		fontSize: 18,
		marginTop: 15,
		fontFamily: Fonts.openSans_400Regular,
	},
});
