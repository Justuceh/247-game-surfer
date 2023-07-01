import { ReactNode } from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface BannerProps {
	children: ReactNode;
}

const Banner = ({ children }: BannerProps) => {
	return (
		<View style={styles.bannerContainer}>
			{children}
			<View style={styles.bannerImageContainer}>
				<Image
					source={require('../assets/247-gs-high-resolution-color-icon.png')}
					style={styles.bannerImage}
					resizeMode='contain'
				/>
			</View>
		</View>
	);
};

export default Banner;

const styles = StyleSheet.create({
	bannerContainer: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'black',
	},
	bannerImageContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	bannerImage: {
		flex: 1,
	},
});
