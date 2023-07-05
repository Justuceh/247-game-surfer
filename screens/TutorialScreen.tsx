import { useContext } from 'react';
import { Text, View, StyleSheet, Modal, Pressable } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';

import { TutorialContext } from '../store/context/tutorial/tutorial-context';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

interface TutorialScreenProps {
	showTutorial: boolean;
}

const TutorialScreen = ({ showTutorial }: TutorialScreenProps) => {
	const tutorialContext = useContext(TutorialContext);

	async function handleOnClose() {
		tutorialContext.setFirstTimeFalse();
	}
	return (
		<View style={styles.container}>
			<Modal visible={showTutorial} animationType='slide' transparent={true}>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.labelText}>
							Thanks for choosing 24/7 Game Surfer!!
						</Text>
						<View style={styles.bodyTextContainer}>
							<Octicons name='dot-fill' color={'white'} />
							<Text style={styles.bodyText}>
								Select any store and begin surfing deals for that store
							</Text>
						</View>
						<View style={styles.bodyTextContainer}>
							<Octicons name='dot-fill' color={'white'} />
							<Text style={styles.bodyText}>
								Press a game to view ratings, description, videos, screenshots
								or purchase the game.
							</Text>
						</View>
						<View style={styles.bodyTextContainer}>
							<Octicons name='dot-fill' color={'white'} />
							<Text style={styles.bodyText}>
								Long Press any game to be taken directly to the purhcase page.
							</Text>
						</View>
						<View style={styles.bodyTextContainer}>
							<Octicons name='dot-fill' color={'white'} />
							<Text style={styles.bodyText}>
								Press the star icon to add a favorite. Favorites can then be
								located from the bottom tab bar.
							</Text>
						</View>
						<View style={styles.bodyTextContainer}>
							<Octicons name='dot-fill' color={'white'} />
							<Text style={styles.bodyText}>
								Select the search icon on the bottom tab bar to search any game
								by name.
							</Text>
						</View>

						<Text style={styles.labelText}>Enjoy!</Text>
						<Pressable
							onPress={handleOnClose}
							style={({ pressed }) => [
								styles.dealButton,
								{ opacity: pressed ? 0.2 : 0.9 },
							]}>
							<Text style={styles.dealButtonText}>Close</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default TutorialScreen;

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		backgroundColor: Colors.charcoal,
		padding: 20,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 4,
		shadowColor: '#c7c7c7',
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 4,
		shadowOpacity: 0.5,
	},
	labelText: {
		fontSize: 20,
		marginBottom: 10,
		fontFamily: Fonts.gameTitleFont,
		color: 'white',
	},
	bodyTextContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	bodyText: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 19,
		fontFamily: Fonts.gameTitleFont,
		color: 'white',
		padding: 5,
		margin: 5,
	},
	dealButton: {
		backgroundColor: '#56ff7b',
		borderWidth: 1,
		borderColor: '#bd1010',
		borderRadius: 10,
		opacity: 0.9,
		padding: 10,
		justifyContent: 'center',
	},
	dealButtonText: {
		textAlign: 'center',
		color: Colors.charcoalDark,
		fontFamily: Fonts.gameTitleFont,
		fontSize: 15,
	},
});
