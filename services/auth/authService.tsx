import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface TokenResponse {
	token: string;
}

class AuthorizationService {
	private api: AxiosInstance;
	private token: string | null;

	constructor() {
		this.api = axios.create({
			baseURL: 'https://api.example.com', // replace with your API's base URL
		});
		this.token = null;
	}

	public async getToken(): Promise<string> {
		if (this.token) {
			return this.token;
		}

		const savedToken = await AsyncStorage.getItem('token');

		if (savedToken) {
			const tokenData: TokenResponse = JSON.parse(savedToken);
			this.token = tokenData.token;
			return this.token;
		}

		const newToken = await this.requestToken();
		this.token = newToken;
		return newToken;
	}

	private async requestToken(): Promise<string> {
		const response = await this.api.post('/auth/token');
		const { token }: TokenResponse = response.data;

		await AsyncStorage.setItem('token', JSON.stringify({ token }));

		return token;
	}

	public async makeRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
		try {
			const token = await this.getToken();

			// Add the token to the request headers
			config.headers = {
				...config.headers,
				Authorization: `Bearer ${token}`,
			};

			const response = await this.api.request(config);

			return response;
		} catch (error: any) {
			if (error.response && error.response.status === 401) {
				// Token expired or invalid, renew the token and retry the request
				await this.renewToken();
				return this.makeRequest(config);
			}

			throw error;
		}
	}

	private async renewToken(): Promise<void> {
		await AsyncStorage.removeItem('token');
		this.token = null;
	}
}

// const ExampleComponent: React.FC = () => {
//   const [data, setData] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await AuthorizationService.makeRequest({
//           url: '/api/data', // replace with your API endpoint
//           method: 'GET',
//         });

//         setData(response.data);
//       } catch (error) {
//         console.error('Request failed:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <View>
//       <Text>{data}</Text>
//     </View>
//   );
// };

// export default ExampleComponent;
