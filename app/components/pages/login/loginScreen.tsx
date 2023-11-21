import { loginUser } from "@/utils/apiClient";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";

type FormData = {
	username: string;
	password: string;
};

function LoginScreen() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<any>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit = async (data: FormData) => {
		setLoading(true);

		if (loading === false) {
			loginUser(data, setLoading, setError);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="bg-gray-800 py-6 px-8 rounded-[20px] h-full shadow-lg w-96"
			>
				<h1 className="text-2xl text-white font-bold mb-6 text-center">
					Logowanie
				</h1>

				<div className="mb-6">
					<label className="block text-white text-sm font-medium mb-3">
						Username
					</label>
					<input
						{...register("username", { required: "Username is required" })}
						placeholder="Username"
						className="border-2 rounded-lg font-sm px-4 py-2 w-full border-gray-700 bg-gray-800 text-white placeholder-grayMain focus:border-buttonColor focus:ring-1 focus:ring-buttonColor focus:outline-none"
					/>
					{errors.username && (
						<p className="text-red">{errors.username.message}</p>
					)}
				</div>

				<div className="mb-8">
					<label className="block text-white text-sm font-medium mb-3">
						Password
					</label>
					<input
						type="password"
						{...register("password", {
							required: "Password is required",
						})}
						placeholder="Password"
						className="border-2 rounded-lg font-sm px-4 py-2 w-full border-gray-700 bg-gray-800 text-white placeholder-grayMain focus:border-buttonColor focus:ring-1 focus:ring-buttonColor focus:outline-none"
					/>
					{errors.password && (
						<p className="text-red">{errors.password.message}</p>
					)}
				</div>

				<button
					type="submit"
					disabled={loading}
					className={`flex items-center justify-center h-[48px] w-full font-sm bg-buttonColor hover:bg-buttonColorHover text-white font-bold rounded-2xl focus:outline-none focus:ring-buttonColor focus:ring-opacity-50 transition-all ${
						loading ? "opacity-70 cursor-not-allowed" : ""
					}`}
				>
					{loading ? <ClipLoader color="#ffffff" size={15} /> : "Zaloguj się"}
				</button>
				<div className="flex items-center justify-center">
					{error && <p className="text-red text-sm mt-2">{error}</p>}
				</div>
				<div className="flex flex-col items-center justify-center mt-5">
					<span className="text-grayMain font-medium text-sm">
						Nie masz konta?{" "}
						<Link className="text-white text-sm font-medium" href="/register">
							Zarejestruj się
						</Link>
					</span>
				</div>
			</form>
		</div>
	);
}

export default LoginScreen;
