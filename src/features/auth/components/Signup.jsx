import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux';
import { selectLoggedInUser, createUserAsync } from '../AuthSlice';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const user = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();
  const [isSeller, setIsSeller] = useState(false);
  const SELLER_VERIFICATION_CODE = "SELLER123";

  if (user) {
    return <Navigate to='/' replace={true} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-6">
        <div className="text-center mb-8">
          <svg 
            className="mx-auto h-12 w-12 text-pink-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
          <h1 className="mt-4 text-2xl font-light text-gray-900">
            Create your account
          </h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white py-8 px-6 shadow-sm border border-gray-100 rounded-lg"
        >
          {/* Toggle switch */}
          <div className="flex justify-center items-center mb-6">
            <span className={`mr-3 text-sm ${!isSeller ? 'text-pink-500' : 'text-gray-400'}`}>User</span>
            <button
              type="button"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isSeller ? 'bg-pink-500' : 'bg-gray-200'}`}
              onClick={() => setIsSeller(!isSeller)}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSeller ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            <span className={`ml-3 text-sm ${isSeller ? 'text-pink-500' : 'text-gray-400'}`}>Seller</span>
          </div>

          {isSeller && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mb-6 bg-pink-50 rounded-lg p-4 text-sm text-pink-700"
            >
              Seller accounts require verification. Please enter the code provided by admin.
            </motion.div>
          )}

          <form onSubmit={handleSubmit((data) => {
            const role = isSeller && data.sellerVerificationCode === SELLER_VERIFICATION_CODE 
              ? 'seller' 
              : 'user';
            dispatch(createUserAsync({email: data.email, password: data.password, addresses: [], role}));
          })}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format"
                      }
                    })}
                    type="email"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-pink-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
                        message: "Must include uppercase, lowercase, number, and special character"
                      }
                    })}
                    type="password"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-pink-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value, formValues) => 
                        value === formValues.password || "Passwords don't match"
                    })}
                    type="password"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-pink-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {isSeller && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <label htmlFor="sellerVerificationCode" className="block text-sm font-medium text-gray-700">
                    Seller Verification Code
                  </label>
                  <div className="mt-1">
                    <input
                      id="sellerVerificationCode"
                      {...register("sellerVerificationCode", {
                        required: isSeller ? "Verification code is required" : false
                      })}
                      type="text"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                    />
                    {errors.sellerVerificationCode && (
                      <p className="mt-1 text-sm text-pink-600">
                        {errors.sellerVerificationCode.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      className="text-xs text-pink-500 hover:text-pink-700"
                      onClick={() => alert("Please contact admin@example.com to become a seller")}
                    >
                      Don't have a code?
                    </button>
                  </div>
                </motion.div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
                >
                  Sign up
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Login
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>By continuing, you agree to our Terms of Service</p>
        </div>
      </div>
    </div>
  );
}