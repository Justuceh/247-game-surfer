import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface ActivityIndicatorProps {
	size: 'small' | 'large';
	color: string;
}

const ActivityIndicatorComponent = ({
	size,
	color,
}: ActivityIndicatorProps) => {
	return (
		<View style={styles.container}>
			<ActivityIndicator size={size} color={color} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default ActivityIndicatorComponent;
