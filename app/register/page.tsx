'use client';
import axios from 'axios';
import { set } from 'mongoose';
import { FormEvent, useState } from 'react';

function Register() {
    const [error, setError] = useState<string | null>(null);
    const [successful, setSuccessful] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const validateForm = (password: string, confirmPassword: string): string | null => {
        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        return null;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const email = formData.get('email') as string;
        const username = formData.get('username') as string;

        const validationError = validateForm(password, confirmPassword);
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/signup', {
                username,
                email,
                password
            });
            setSuccessful(true);
            // Handle successful registration (e.g., redirect to login page)
        }  catch (err) {
            if (axios.isAxiosError(err)) {
                // Error específico de Axios
                setError(err.response?.data?.message || 'An unexpected error occurred');
            } else if (err instanceof Error) {
                // Error genérico de JavaScript
                setError(err.message);
            } else {
                // Error desconocido
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-1">
            {successful ? (
                <div>
                    <h2 className="text-3xl font-bold">Registration Successful</h2>
                    <p className="text-green-500">
                        You have successfully registered. Please check your email to verify your account.
                    </p>
                </div>
            ) : (
                <>
                    <h2 className="text-3xl font-bold">Register</h2>
                    <form
                        onSubmit={handleSubmit}
                        className="text-gray-700 mt-4 flex flex-col gap-3 bg-blue-100 p-5 rounded-md"
                    >
                        <input
                            name="username"
                            type="text"
                            placeholder="Username"
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                        {error && <p className="text-red-500">{error}</p>}
                        <button
                            type="submit"
                            className="bg-blue-500 text-white p-2 rounded-md"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

export default Register;