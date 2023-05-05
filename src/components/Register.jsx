import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../Firebase";
import { useNavigate, Link } from 'react-router-dom';
import bg from '../img/bg.jpg'

const Register = () => {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            // Create a new user with email and password
            const { user } = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Save user data to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
            });

            // Show success message and clear error message
            setSuccessMessage('Registration successful!');
            setErrorMessage('');

            // Clear fields
            setFormData({
                firstName: '',
                lastName: '',
                dob: '',
                email: '',
                password: '',
                confirmPassword: '',
            });

            // Redirect to another page or display a success message
            navigate('/');
        } catch (error) {
            console.error('Error during registration:', error.message);
            setErrorMessage('Error during registration: ' + error.message);
            setSuccessMessage('');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-center items-center h-full overflow-hidden">
            {successMessage && (
                <div className="absolute top-0 right-0 bg-green-500 text-white p-2 rounded-bl-md">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-bl-md">
                    {errorMessage}
                </div>
            )}
            <div className="hidden lg:relative lg:flex lg:justify-center lg:items-center lg:h-screen">
                <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                    <img src={bg} alt="" className=" opacity-40 mix-blend-multiply" />
                </div>
                <div className="absolute flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-semibold text-white">Appointment Setter</h1>
                    <div className="w-72 mt-4 mb-2 border-b border-white"></div>
                    <h1 className=" text-white">Set appointment anytime and anywhere!</h1>
                </div>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center w-full h-screen">
                <h1 className=" text-3xl font-semibold text-gray-700">Sign Up</h1>
                <form className="mt-8 w-72 lg:w-96 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="sr-only">
                                First Name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                required
                                className="appearance-none rounded-none relative block w-full bg-transparent py-2 border-b
                                 border-zinc-950 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none 
                                 focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="sr-only">
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                required
                                className="appearance-none rounded-none relative block w-full bg-transparent py-2 border-b
                                 border-zinc-950 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none 
                                 focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none rounded-none relative block w-full bg-transparent py-2 border-b
                             border-zinc-950 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none 
                             focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="appearance-none rounded-none relative block w-full bg-transparent py-2 border-b
                             border-zinc-950 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none 
                             focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="sr-only">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="appearance-none rounded-none relative block w-full bg-transparent py-2 border-b
                             border-zinc-950 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none 
                             focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm 
                            font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
                            focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <p className="text-sm">
                    Already have an account? Login <Link className="text-sky-800" to="/">here</Link>.
                </p>
            </div>
        </div>
    )
}

export default Register