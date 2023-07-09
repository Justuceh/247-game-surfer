import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

interface SearchInputProps {
	onSearchHandler: (data: any) => any;
	onClearHandler: () => void;
	onChangeText: (text: string) => void;
	backgroundColor?: string;
	buttonColor?: string;
	buttonTextColor?: string;
	placeholderTextColor?: string;
	clearValue: boolean | undefined;
}

const SearchInput = ({
	onSearchHandler,
	onClearHandler,
	onChangeText,
	placeholderTextColor,
	buttonTextColor,
	backgroundColor,
	buttonColor,
	clearValue,
}: SearchInputProps) => {
	const [searchQuery, setSearchQuery] = useState('');
	function onPressHandler() {
		onSearchHandler(searchQuery);
	}

	useEffect(() => {
		if (clearValue) {
			setSearchQuery('');
		}
	}, [clearValue]);

	return (
		<View style={styles.rootContainer}>
			<TextInput
				style={[
					styles.searchInput,
					{ color: buttonTextColor, backgroundColor: backgroundColor },
				]}
				value={searchQuery}
				onChangeText={(text) => {
					setSearchQuery(text);
					onChangeText(text);
				}}
				onSubmitEditing={onPressHandler}
				placeholder='search by game name...'
				placeholderTextColor={placeholderTextColor}
			/>
			{searchQuery !== '' && (
				<Pressable
					onPress={() => {
						setSearchQuery('');
						onClearHandler();
					}}
					style={({ pressed }) => [
						styles.clearButton,
						{ opacity: pressed ? 0.2 : 0.9 },
					]}>
					<Icon name='clear' size={20} color={'white'} />
				</Pressable>
			)}
			<Pressable
				onPress={onPressHandler}
				style={({ pressed }) => {
					return pressed
						? [
								{ backgroundColor: buttonColor },
								styles.searchButton,
								styles.buttonPressed,
						  ]
						: [{ backgroundColor: buttonColor }, styles.searchButton];
				}}>
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
		backgroundColor: Colors.charcoalLight,
	},
	searchInput: {
		flex: 3,
		borderWidth: 1,
		borderColor: '#ffffff',
		borderRadius: 89,
		marginRight: 10,
		padding: 5,
		opacity: 0.9,
		justifyContent: 'center',
	},
	searchButton: {
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#ffffff',
		borderRadius: 10,
		opacity: 0.9,
		flex: 1,
		padding: 5,
		justifyContent: 'center',
	},
	searchText: {
		fontFamily: Fonts.itimFont,
		textAlign: 'center',
		fontSize: 15,
		fontWeight: '400',
	},
	buttonPressed: {
		opacity: 0.5,
	},
	clearButton: {
		marginRight: 10,
		justifyContent: 'center',
		alignItems: 'center',
		width: 25,
		height: 25,
		borderRadius: 12.5,
	},
	clearText: {
		fontSize: 16,
	},
});
