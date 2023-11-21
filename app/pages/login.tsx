import LoginScreen from "@/components/pages/login/loginScreen";
import { getCookies } from "cookies-next";
import { GetServerSidePropsContext } from "next";

export default function Login() {
	return (
		<div className="bg-gray-900">
			<LoginScreen />
		</div>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const cookies = getCookies(context);

	if (cookies.refreshToken) {
		// Jeżeli nie ma tokena, przekieruj na stronę logowania
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	// Jeżeli jest token, kontynuuj ładowanie strony
	return {
		props: {},
	};
}
