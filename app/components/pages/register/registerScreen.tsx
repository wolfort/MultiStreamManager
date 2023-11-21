import { useApiRequest } from "@/utils/useApiRequest";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";

type FormData = {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
	companyName: string;
};

const RegisterForm: React.FC = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormData>();
	const registerRequest = useApiRequest();
	const router = useRouter();

	const onSubmit = (data: FormData) => {
		registerRequest.makeRequest({
			method: "POST",
			url: "/users/register",
			data: data,
		});
	};

	const password = watch("password", "");

	return (
		<div className="min-h-screen flex items-center justify-center">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="bg-gray-800 py-6 px-8 rounded-[20px] h-full shadow-lg w-96"
			>
				<h1 className="text-2xl text-white font-bold mb-6 text-center">
					Rejestracja
				</h1>

				{registerRequest.status === "success" ? (
					<>
						<p className="text-green text-sm mb-6 text-center">
							{registerRequest?.data?.message}
						</p>
						<button
							type="button"
							onClick={() => {
								router.push("/login");
							}}
							className={`flex items-center justify-center h-[48px] w-full font-sm bg-buttonColor hover:bg-buttonColorHover text-white font-bold rounded-2xl focus:outline-none focus:ring-buttonColor focus:ring-opacity-50 transition-all`}
						>
							Ekran logowania
						</button>
					</>
				) : (
					<>
						<div className="mb-6">
							<label className="block text-white text-sm font-medium mb-3">
								Username
							</label>
							<input
								type="text"
								{...register("username", {
									required: "Username is required",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
										message: "Invalid username address",
									},
								})}
								placeholder="Username"
								className="border-2 rounded-lg font-sm px-4 py-2 w-full border-gray-700 bg-gray-800 text-white placeholder-grayMain focus:border-buttonColor focus:ring-1 focus:ring-buttonColor focus:outline-none"
							/>
							{errors.username && (
								<p className="text-red">{errors.username.message}</p>
							)}
						</div>

						<div className="mb-6">
							<label className="block text-white text-sm font-medium mb-3">
								Email
							</label>
							<input
								type="email"
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
										message: "Invalid email address",
									},
								})}
								placeholder="Email"
								className="border-2 rounded-lg font-sm px-4 py-2 w-full border-gray-700 bg-gray-800 text-white placeholder-grayMain focus:border-buttonColor focus:ring-1 focus:ring-buttonColor focus:outline-none"
							/>
							{errors.email && (
								<p className="text-red">{errors.email.message}</p>
							)}
						</div>

						<div className="mb-6">
							<label className="block text-white text-sm font-medium mb-3">
								Password
							</label>
							<input
								type="password"
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 8,
										message: "Password must have at least 8 characters",
									},
									pattern: {
										value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
										message:
											"Password must contain at least one uppercase letter, one lowercase letter, and one number",
									},
								})}
								placeholder="Password"
								className="border-2 rounded-lg font-sm px-4 py-2 w-full border-gray-700 bg-gray-800 text-white placeholder-grayMain focus:border-buttonColor focus:ring-1 focus:ring-buttonColor focus:outline-none"
							/>
							{errors.password && (
								<p className="text-red">{errors.password.message}</p>
							)}
						</div>

						<div className="mb-8">
							<label className="block text-white text-sm font-medium mb-3">
								Confirm password
							</label>
							<input
								type="password"
								{...register("confirmPassword", {
									required: "Please confirm your password",
									validate: (value) =>
										value === password || "The passwords do not match",
								})}
								placeholder="Confirm password"
								className="border-2 rounded-lg font-sm px-4 py-2 w-full border-gray-700 bg-gray-800 text-white placeholder-grayMain focus:border-buttonColor focus:ring-1 focus:ring-buttonColor focus:outline-none"
							/>
							{errors.confirmPassword && (
								<p className="text-red">{errors.confirmPassword.message}</p>
							)}
						</div>

						<button
							type="submit"
							disabled={registerRequest.status === "loading" ? true : false}
							className={`flex items-center justify-center h-[48px] w-full font-sm bg-buttonColor hover:bg-buttonColorHover text-white font-bold rounded-2xl focus:outline-none focus:ring-buttonColor focus:ring-opacity-50 transition-all ${
								registerRequest.status === "loading"
									? "opacity-70 cursor-not-allowed"
									: ""
							}`}
						>
							{registerRequest.status === "loading" ? (
								<ClipLoader color="#ffffff" size={15} />
							) : (
								"Zarejestruj się"
							)}
						</button>
						<div className="flex items-center justify-center">
							{registerRequest.status === "error" && (
								<p className="text-red text-sm mt-2">{registerRequest.error}</p>
							)}
						</div>
						<div className="flex flex-col items-center justify-center mt-5">
							<span className="text-grayMain font-medium text-sm">
								Masz już konto?{" "}
								<Link className="text-white text-sm font-medium" href="/login">
									Zaloguj się
								</Link>
							</span>
						</div>
					</>
				)}
			</form>
		</div>
	);
};

export default RegisterForm;
