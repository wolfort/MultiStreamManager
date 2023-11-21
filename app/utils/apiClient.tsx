import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const apiClient = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
});

export default apiClient;

apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (originalRequest.url.includes("/users/login")) {
			return Promise.reject(error);
		}

		// Obsługa błędu autoryzacji (401 Unauthorized)
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			const refreshToken = getRefreshTokenFromCookies();

			if (!refreshToken) {
				console.error("Brak tokena odświeżania.");
				if (typeof window !== "undefined") {
					window.location.href = "/login";
				}

				return Promise.reject(error);
			}

			try {
				const response = await apiClient.post("/users/refresh-token", {
					token: refreshToken,
				});

				const newAccessToken = response.data.data.accessToken;

				saveAccessTokenToCookies(newAccessToken);

				apiClient.defaults.headers.common["Authorization"] =
					"Bearer " + newAccessToken;
				originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

				return apiClient(originalRequest);
			} catch (refreshError) {
				// Jeśli odświeżenie tokena nie powiedzie się, usuń tokeny, nagłówek i przekieruj użytkownika.
				removeTokensFromCookies();
				delete apiClient.defaults.headers.common["Authorization"];

				if (typeof window !== "undefined") {
					window.location.href = "/login";
				}

				return Promise.reject(refreshError);
			}
		}

		// Możesz dodać obsługę innych kodów błędów HTTP tutaj
		if (error.response.status === 403) {
			console.error("Dostęp zabroniony. Brak odpowiednich uprawnień.");
		}

		if (error.response.status === 500) {
			console.error("Błąd serwera. Proszę spróbować później.");
		}

		return Promise.reject(error);
	}
);

export function removeTokensFromCookies() {
	Cookies.remove("accessToken");
	Cookies.remove("refreshToken");
}

export function getRefreshTokenFromCookies() {
	const refreshToken = Cookies.get("refreshToken");
	return refreshToken || null;
}
export function getAccessTokenFromCookies() {
	const accessToken = Cookies.get("accessToken");
	return accessToken || null;
}

function saveAccessTokenToCookies(token: string) {
	Cookies.set("accessToken", token, {
		sameSite: process.env.NEXT_PUBLIC_ENV === "development" ? "strict" : "none",
		secure: process.env.NEXT_PUBLIC_ENV === "development" ? false : true,
		expires: new Date(new Date().getTime() + 60 * 60 * 1000), // to odpowiada 1h
	});
}

function saveRefreshTokenToCookies(token: string) {
	Cookies.set("refreshToken", token, {
		sameSite: process.env.NEXT_PUBLIC_ENV === "development" ? "strict" : "none",
		secure: process.env.NEXT_PUBLIC_ENV === "development" ? false : true,
		expires: 30, // to odpowiada 30d
	});
}

export async function loginUser(
	credentials: {
		username: string;
		password: string;
	},
	setLoading: any,
	setError: any
) {
	try {
		// Wysyłasz dane do logowania na serwer
		setError("");
		const response = await apiClient.post("/users/login", credentials);

		// Zapisujesz otrzymane tokeny w ciasteczkach
		const { accessToken, refreshToken } = response.data.data;

		saveAccessTokenToCookies(accessToken);
		saveRefreshTokenToCookies(refreshToken); // Musisz dodać tę funkcję poniżej

		// Teraz możesz przekierować użytkownika na główną stronę lub jakąś inną
		if (typeof window !== "undefined") {
			setLoading(false);
			window.location.href = "/";
		}
	} catch (error: any) {
		setLoading(false);
		console.error("Błąd podczas logowania:", error);
		setError(error.response.data.message ? error.response.data.message : error);
		// Możesz obsłużyć błędy logowania tutaj, np. wyświetlić komunikat o błędzie
	}
}
