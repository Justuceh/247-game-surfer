import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface CardProps {
	children: ReactNode | undefined;
	style?: { color?: string; backgroundColor?: string };
}

const Card = ({ children, style }: CardProps) => {
	return (
		<View
			style={
				style
					? [{ ...style }, styles.cardContainer]
					: [{ backgroundColor: 'white' }, styles.cardContainer]
			}>
			{children}
		</View>
	);
};

export default Card;

const styles = StyleSheet.create({
	cardContainer: {
		margin: 6,
		padding: 4,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 4,
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 6,
		shadowOpacity: 0.25,
		flex: 1,
		flexBasis: 0,
	},
});
