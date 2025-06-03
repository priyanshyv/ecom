import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, updateUserAsync } from '../UserSlice';
import { useForm } from 'react-hook-form';
import Navbar from '../../navbar/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

export default function UserProfile() {
  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);
  const [selectedEditIndex, setSelectedEditIndex] = useState(-1);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleEdit = (addressUpdate, index) => {
    const newUser = { ...user, addresses: [...user.addresses] };
    newUser.addresses.splice(index, 1, addressUpdate);
    dispatch(updateUserAsync(newUser));
    setSelectedEditIndex(-1);
  };

  const handleRemove = (e, index) => {
    const newUser = { ...user, addresses: [...user.addresses] };
    newUser.addresses.splice(index, 1);
    dispatch(updateUserAsync(newUser));
  };

  const handleEditForm = (index) => {
    setSelectedEditIndex(index);
    const address = user.addresses[index];
    setValue('name', address.name);
    setValue('email', address.email);
    setValue('city', address.city);
    setValue('state', address.state);
    setValue('pinCode', address.pinCode);
    setValue('phone', address.phone);
    setValue('street', address.street);
  };

  const handleAdd = (address) => {
    const newUser = { ...user, addresses: [...user.addresses, address] };
    dispatch(updateUserAsync(newUser));
    setShowAddAddressForm(false);
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const formVariants = {
    hidden: { opacity: 0, height: 0 },
    show: { opacity: 1, height: 'auto' }
  };

  return (
    <Navbar>
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* User Info Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 mt-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">
              {user.name ? user.name : 'New User'}
            </h1>
            <div className="mt-4 flex items-center">
              <span className="text-lg text-gray-700">{user.email}</span>
              {user.role === 'admin' && (
                <span className="ml-4 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                  {user.role}
                </span>
              )}
            </div>
          </motion.div>

          {/* Addresses Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Your Addresses</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setShowAddAddressForm(true); setSelectedEditIndex(-1); }}
                  className="flex items-center gap-2 rounded-md bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-700"
                >
                  <FaPlus /> Add New Address
                </motion.button>
              </div>
            </div>

            {/* Add Address Form */}
            <AnimatePresence>
              {showAddAddressForm && (
                <motion.div
                  variants={formVariants}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  transition={{ duration: 0.3 }}
                  className="px-6 py-4 border-b border-gray-200"
                >
                  <form
                    noValidate
                    onSubmit={handleSubmit((data) => {
                      handleAdd(data);
                      reset();
                    })}
                  >
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Add New Address</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Use a permanent address where you can receive mail.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full name
                          </label>
                          <input
                            type="text"
                            {...register('name', { required: 'Name is required' })}
                            id="name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                          />
                          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                          </label>
                          <input
                            id="email"
                            {...register('email', { required: 'Email is required' })}
                            type="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                          />
                          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone
                          </label>
                          <input
                            id="phone"
                            {...register('phone', { required: 'Phone is required' })}
                            type="tel"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                          />
                          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                            Street address
                          </label>
                          <input
                            type="text"
                            {...register('street', { required: 'Street is required' })}
                            id="street"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                          />
                          {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
                        </div>

                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                          </label>
                          <input
                            type="text"
                            {...register('city', { required: 'City is required' })}
                            id="city"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                          />
                          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                        </div>

                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                            State / Province
                          </label>
                          <input
                            type="text"
                            {...register('state', { required: 'State is required' })}
                            id="state"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                          />
                          {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
                        </div>

                        <div>
                          <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">
                            ZIP / Postal code
                          </label>
                          <input
                            type="text"
                            {...register('pinCode', { required: 'Postal code is required' })}
                            id="pinCode"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                          />
                          {errors.pinCode && <p className="mt-1 text-sm text-red-600">{errors.pinCode.message}</p>}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="button"
                          onClick={() => setShowAddAddressForm(false)}
                          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                        >
                          <FaTimes className="inline mr-2" /> Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          className="rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-700"
                        >
                          Save Address
                        </motion.button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Address List */}
            <div className="divide-y divide-gray-200">
              <AnimatePresence>
                {user.addresses.map((address, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                  >
                    {selectedEditIndex === index ? (
                      <motion.div
                        variants={formVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="mb-6"
                      >
                        <form
                          noValidate
                          onSubmit={handleSubmit((data) => {
                            handleEdit(data, index);
                            reset();
                          })}
                        >
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">Edit Address</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                              <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                  Full name
                                </label>
                                <input
                                  type="text"
                                  {...register('name', { required: 'Name is required' })}
                                  id="name"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                              </div>

                              <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                  Email address
                                </label>
                                <input
                                  id="email"
                                  {...register('email', { required: 'Email is required' })}
                                  type="email"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                              </div>

                              <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                  Phone
                                </label>
                                <input
                                  id="phone"
                                  {...register('phone', { required: 'Phone is required' })}
                                  type="tel"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                              </div>

                              <div className="sm:col-span-2">
                                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                                  Street address
                                </label>
                                <input
                                  type="text"
                                  {...register('street', { required: 'Street is required' })}
                                  id="street"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                />
                                {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
                              </div>

                              <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                  City
                                </label>
                                <input
                                  type="text"
                                  {...register('city', { required: 'City is required' })}
                                  id="city"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                />
                                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                              </div>

                              <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                  State / Province
                                </label>
                                <input
                                  type="text"
                                  {...register('state', { required: 'State is required' })}
                                  id="state"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                />
                                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
                              </div>

                              <div>
                                <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">
                                  ZIP / Postal code
                                </label>
                                <input
                                  type="text"
                                  {...register('pinCode', { required: 'Postal code is required' })}
                                  id="pinCode"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                />
                                {errors.pinCode && <p className="mt-1 text-sm text-red-600">{errors.pinCode.message}</p>}
                              </div>
                            </div>

                            <div className="flex justify-end gap-3">
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                onClick={() => setSelectedEditIndex(-1)}
                                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                              >
                                <FaTimes className="inline mr-2" /> Cancel
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                className="rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-700"
                              >
                                Save Changes
                              </motion.button>
                            </div>
                          </div>
                        </form>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{address.name}</h3>
                          <p className="mt-1 text-gray-600">{address.street}</p>
                          <p className="text-gray-600">
                            {address.city}, {address.state} {address.pinCode}
                          </p>
                          <p className="mt-2 text-gray-500">{address.email}</p>
                          <p className="text-gray-500">Phone: {address.phone}</p>
                        </div>
                        <div className="flex gap-3 sm:flex-col sm:items-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEditForm(index)}
                            className="flex items-center gap-1 text-pink-600 hover:text-pink-800"
                          >
                            <FaEdit /> Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => handleRemove(e, index)}
                            className="flex items-center gap-1 text-pink-600 hover:text-pink-800"
                          >
                            <FaTrash /> Remove
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
}