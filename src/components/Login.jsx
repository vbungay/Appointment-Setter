import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase';
import { useNavigate, Link } from 'react-router-dom';
import bg from '../img/bg.jpg';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            navigate('/calendar');
        } catch (error) {
            console.error('Error during login:', error.message);
            alert('Error during login: ' + error.message);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-center items-center h-full overflow-hidden">
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
                <h1 className=" text-3xl font-semibold text-gray-700">Login</h1>
                <form className="mt-8 w-72 lg:w-96 space-y-6" onSubmit={handleSubmit}>
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
                            autoComplete="current-password"
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
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm 
                            font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
                            focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <p className="text-sm">
                    Don't have an account? Register <Link className="text-sky-800" to="/register">here</Link>.
                </p>
            </div>
        </div>
    );
};

export default Login;
