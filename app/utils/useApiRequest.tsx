import { useState } from "react";
import apiClient, { getAccessTokenFromCookies } from "./apiClient"; // Twój klient Axios

type ApiRequestStatus = "idle" | "loading" | "success" | "error";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestConfig {
	method: HttpMethod;
	url: string;
	data?: any;
	headers?: Record<string, string>;
	// ... inne opcje Axios mogą być tu dodane w miarę potrzeb
}

interface UseApiRequestReturnType {
	status: ApiRequestStatus;
	data: any;
	error: any;
	makeRequest: (config: RequestConfig) => Promise<void>;
}

export const useApiRequest = (): UseApiRequestReturnType => {
	const [status, setStatus] = useState<ApiRequestStatus>("idle");
	const [data, setData] = useState<any>(null);
	const [error, setError] = useState<any>(null);

	const makeRequest = async (config: RequestConfig) => {
		setStatus("loading");
		try {
			const token = getAccessTokenFromCookies();

			const response = await apiClient({
				...config,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setData(response.data);
			setStatus("success");
		} catch (err: any) {
			console.log(err);
			setError(err?.response?.data?.message ? err.response.data.message : err);
			setStatus("error");
		}
	};

	return {
		status,
		data,
		error,
		makeRequest,
	};
};
