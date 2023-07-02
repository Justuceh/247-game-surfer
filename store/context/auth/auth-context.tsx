import React, { createContext, useState, ReactNode, useEffect } from 'react';
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
			staleTime: 1000 * 60 * 60 * 24, // Cache the token for one day
		}
	);

	const refreshToken = async () => {
		// After refreshing, store the new token in AsyncStorage and in state:
		const queryResult = await refetch();

		if (queryResult?.data !== undefined) {
			const newToken = queryResult.data.access_token;
			const newTokenType = queryResult.data.token_type;
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

	useEffect(() => {
		refreshToken(); // Fetch a fresh token when the app is opened
	}, []);

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
