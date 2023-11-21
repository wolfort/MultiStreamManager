import RegisterScreen from "@/components/pages/register/registerScreen";
import { getCookies } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import React from "react";

function Register() {
	return (
		<div className="bg-gray-900">
			<RegisterScreen />
		</div>
	);
}

export default Register;

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
