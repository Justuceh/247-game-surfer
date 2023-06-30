import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import qs from 'qs';

import { TWITCH_TOKEN_URL, IGDB_SECRET, IGDB_CLIENT_ID } from '@env';

interface AuthContextData {
	refreshToken(): Promise<void>;
	getRequestHeaders: () => {
		Authorization: string;
		'Client-ID': string;
		Accept: string;
	};
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [data, setData] = useState<{
		token: string | null;
		tokenType: string | null;
	}>({ token: null, tokenType: '' });
	const [enableQuery, setEnableQuery] = useState<boolean>(false);

	async function fetchToken() {
		const data = {
			client_id: IGDB_CLIENT_ID,
			client_secret: IGDB_SECRET,
			grant_type: 'client_credentials',
		};

		const config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		};
		return await axios
			.post(`${TWITCH_TOKEN_URL}`, qs.stringify(data), config)
			.then((response) => {
				if (!response) {
					throw new Error('Network response was not ok');
				}
				return response.data;
			})
			.catch((err) => err);
	}

	const {
		data: freshAuthToken,
		isLoading,
		refetch,
	} = useQuery<{ access_token: string; token_type: string }>(
		[`authToken`, enableQuery],
		fetchToken,
		{
			enabled: enableQuery,
		}
	);

	useEffect(() => {
		async function loadStoredData() {
			const token = await AsyncStorage.getItem('authToken');
			const tokenType = await AsyncStorage.getItem('tokenType');
			if (token) {
				setData({ token: token, tokenType: tokenType });
			} else if (freshAuthToken === undefined) {
				setEnableQuery(true);
			}
		}

		loadStoredData();
	}, []);

	useEffect(() => {
		if (freshAuthToken !== undefined) {
			setData({
				token: freshAuthToken.access_token,
				tokenType: freshAuthToken.token_type,
			});
			AsyncStorage.setItem('authToken', freshAuthToken.access_token);
			AsyncStorage.setItem('tokenType', freshAuthToken.token_type);
		}
	}, [freshAuthToken]);

	const refreshToken = async () => {
		// After refreshing, store the new token in AsyncStorage and in state:
		const queryResult = await refetch();

		if (queryResult?.data !== undefined) {
			const newToken = queryResult.data.access_token;
			const newTokenType = queryResult.data.token_type;
			AsyncStorage.setItem('authToken', newToken);
			setData({ token: newToken, tokenType: newTokenType });
		}
	};

	const getRequestHeaders = () => {
		return {
			Authorization: `Bearer ${data.token}`,
			'Client-ID': IGDB_CLIENT_ID,
			Accept: 'application/json',
		};
	};

	return (
		<AuthContext.Provider
			value={{
				refreshToken,
				getRequestHeaders,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthProvider };
