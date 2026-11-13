import { auth } from "@clerk/tanstack-react-start/server";
import axios from "axios";

const api = axios.create({
	timeout: 50000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

api.interceptors.request.use(async (config) => {
	const { getToken } = await auth();
	const token = await getToken();

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

api.interceptors.response.use(
	(response) => {
		// Triggers for any 2xx status code
		// You can unpack data globally to avoid writing '.data' every time

		return response;
	},
	(error) => {
		// Triggers for status codes outside the 2xx range
		if (error.response && error.response.status === 401) {
			// Global action: redirect to login or trigger a token refresh
			window.location.href = "/sign-in";
		}
		return Promise.reject(error);
	},
);

type APIErrResponse = {
	success: boolean;
	status: number;
	message: string;
};

function handleAPIError(error: any) {
	if (axios.isAxiosError(error)) {
		const err = error.response?.data as APIErrResponse;
		if (!err.success) {
			throw new Error(err.message);
		}
	} else {
		// Handle other types of errors
		throw new Error(error?.message ?? "Could not process your request");
	}
}

export { type APIErrResponse, api, handleAPIError };
