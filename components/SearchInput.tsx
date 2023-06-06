import { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';

interface SearchInputProps {
	onSearchHandler: (data: any) => any;
	onChangeText: (text: string) => void;
	backgroundColor?: string;
	buttonColor?: string;
	buttonTextColor?: string;
	placeholderTextColor?: string;
}

const SearchInput = ({
	onSearchHandler,
	onChangeText,
	placeholderTextColor,
	buttonTextColor,
	backgroundColor,
	buttonColor,
}: SearchInputProps) => {
	const [searchQuery, setSearchQuery] = useState('');
	function onPressHandler() {
		onSearchHandler(searchQuery);
	}
	return (
		<View style={styles.rootContainer}>
			<TextInput
				style={[
					{ color: buttonTextColor, backgroundColor: backgroundColor },
					styles.searchInput,
				]}
				value={searchQuery}
				onChangeText={(text) => {
					setSearchQuery(text);
					onChangeText(text);
				}}
				placeholder='Search...'
				placeholderTextColor={placeholderTextColor}
			/>
			<Pressable
				onPress={onPressHandler}
				style={[{ backgroundColor: buttonColor }, styles.searchButton]}>
				<Text style={styles.searchText}>Search</Text>
			</Pressable>
		</View>
	);
};

export default SearchInput;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: '10%',
		margin: 5,
	},
	searchInput: {
		flex: 3,
		borderWidth: 1,
		borderColor: '#837f7e',
		borderRadius: 89,
		marginRight: 10,
		padding: 5,
		opacity: 0.7,
		justifyContent: 'center',
	},
	searchButton: {
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#837f7e',
		borderRadius: 10,
		opacity: 0.7,
		flex: 1,
		padding: 5,
		justifyContent: 'center',
	},
	searchText: {
		textAlign: 'center',
		fontSize: 12,
		fontWeight: '400',
	},
});
