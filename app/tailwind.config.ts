import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			colors: {
				main: "var(--main)",
				// mainHover: "var(--mainHover)",
				grayMain: "var(--grayMain)",
				bgLeft: "var(--bgLeft)",
				bgRight: "var(--bgRight)",
				buttonColor: "var(--buttonColor)",
				buttonColorHover: "var(--buttonColorHover)",
				red: "var(--red)",
				redHover: "var(--redHover)",
				orange: "var(--orange)",
				orangeHover: "var(--orangeHover)",
				green: "var(--green)",
			},
		},
	},
	plugins: [],
};
export default config;
