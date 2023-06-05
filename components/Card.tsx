import { ReactNode } from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface CardProps {
	children: ReactNode | undefined;
}

const Card = ({ children }: CardProps) => {
	return (
		<View style={styles.cardContainer}>
			<Text>{children}</Text>
		</View>
	);
};

export default Card;

const styles = StyleSheet.create({
	cardContainer: {
		margin: 8,
		backgroundColor: 'white',
		padding: 10,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 4,
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 6,
		shadowOpacity: 0.25,
		flexDirection: 'row',
		flex: 1,
		aspectRatio: 1,
	},
});
