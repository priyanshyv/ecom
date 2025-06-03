import { ChevronDownIcon } from '@heroicons/react/16/solid'
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteItemFromCartAsync,
  selectItems,
  updateCartAsync
} from '../features/cart/CartSlice';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { updateUserAsync } from '../features/auth/AuthSlice';
import { createOrderAsync, selectCurrentOrder } from '../features/order/orderSlice';
import { selectUserInfo } from '../features/user/UserSlice';

const Checkout = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const currentOrder = useSelector(selectCurrentOrder);
  const user = useSelector(selectUserInfo);
  const items = useSelector(selectItems);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const totalAmount = items.reduce((amount, item) => item.price * item.quantity + amount, 0);
  const totalItems = items.reduce((total, item) => item.quantity + total, 0);

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ ...item, quantity: +e.target.value }));
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id))
  }

  const handleAddress = (e) => {
    setSelectedAddress(user.addresses[e.target.value]);
  }

  const handlePayment = (e) => {
    setPaymentMethod(e.target.value);
  }

  const handleOrder = (e) => {
    if (!selectedAddress) {
      alert('Please select an address');
      return;
    }
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    const order = { items, totalAmount, totalItems, user, paymentMethod, selectedAddress, status: 'pending' }
    dispatch(createOrderAsync(order))
  }

  return (
    <>
      {!items.length && <Navigate to='/' replace={true}></Navigate>}
      {currentOrder && <Navigate to={`/order-success/${currentOrder.id}`} replace={true}></Navigate>}
      
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          <div className='grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-5'>
            {/* Left Column - Address and Payment */}
            <div className='lg:col-span-3'>
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                
                <form onSubmit={handleSubmit((data) => {
                  console.log(data);
                  dispatch(
                    updateUserAsync({ ...user, addresses: [...user.addresses, data] })
                  );
                  reset();
                })}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full name
                        </label>
                        <div className="mt-1">
                          <input
                            id="name"
                            {...register('name', { required: 'name is required' })}
                            type="text"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
                          />
                          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email address
                        </label>
                        <div className="mt-1">
                          <input
                            id="email"
                            {...register('email', { required: 'email is required' })}
                            type="email"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
                          />
                          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <div className="mt-1">
                          <input
                            id="phone"
                            {...register('phone', { required: 'phone is required' })}
                            type="tel"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
                          />
                          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                          Street address
                        </label>
                        <div className="mt-1">
                          <input
                            id="street"
                            {...register('street', { required: 'street-address is required' })}
                            type="text"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
                          />
                          {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <div className="mt-1">
                          <input
                            id="city"
                            {...register('city', { required: 'city is required' })}
                            type="text"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
                          />
                          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          State / Province
                        </label>
                        <div className="mt-1">
                          <input
                            id="state"
                            {...register('state', { required: 'state is required' })}
                            type="text"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
                          />
                          {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">
                          ZIP / Postal code
                        </label>
                        <div className="mt-1">
                          <input
                            id="pinCode"
                            {...register('pinCode', { required: 'pinCode is required' })}
                            type="text"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
                          />
                          {errors.pinCode && <p className="mt-1 text-sm text-red-600">{errors.pinCode.message}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-x-4">
                      <button type="button" className="text-sm font-medium text-gray-600 hover:text-gray-800" onClick={(e) => {
                        reset();
                      }}>
                        Reset
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-pink-100 px-4 py-2 text-sm font-medium text-pink-700 shadow-sm hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Saved Addresses */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Saved Addresses</h2>
                <p className="text-sm text-gray-500 mb-4">Choose from your existing addresses</p>
            {user?.addresses?.length > 0 && (
                <div className="space-y-4">
                  {user.addresses.map((address, index) => (
                    <div key={index} className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors">
                      <input
                        onChange={handleAddress}
                        name='address'
                        type="radio"
                        value={index}
                        className="mt-1 h-4 w-4 border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{address.name}</p>
                          <span className="ml-2 inline-flex items-center rounded bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-800">
                            {index === 0 ? 'Default' : 'Secondary'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{address.street}</p>
                        <p className="text-sm text-gray-600">{address.city}, {address.state} {address.pinCode}</p>
                        <p className="text-sm text-gray-600 mt-1">Phone: {address.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
              

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                <p className="text-sm text-gray-500 mb-4">Choose your preferred payment method</p>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors">
                    <input
                      id="cash"
                      name="payments"
                      onChange={handlePayment}
                      value='cash'
                      type="radio"
                      checked={paymentMethod === 'cash'}
                      className="h-4 w-4 border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <label htmlFor="cash" className="ml-3 block text-sm font-medium text-gray-700">
                      <span>Cash on Delivery</span>
                      <p className="text-sm text-gray-500 mt-1">Pay with cash upon delivery</p>
                    </label>
                  </div>
                  
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors">
                    <input
                      id="card"
                      name="payments"
                      onChange={handlePayment}
                      value='card'
                      type="radio"
                      checked={paymentMethod === 'card'}
                      className="h-4 w-4 border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                      <span>Credit/Debit Card</span>
                      <p className="text-sm text-gray-500 mt-1">Pay securely with your card</p>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className='lg:col-span-2'>
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Items ({totalItems})</h3>
                    
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
                          </div>
                          
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h4>
                                <Link to={`/product-detail/${item.id}`} className="hover:text-pink-600">{item.title}</Link>
                              </h4>
                              <p>${item.price}</p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-1">
                              <div className="flex items-center">
                                <label htmlFor={`quantity-${item.id}`} className="mr-2 text-sm text-gray-600">Qty:</label>
                                <select
                                  id={`quantity-${item.id}`}
                                  onChange={(e) => handleQuantity(e, item)}
                                  value={item.quantity}
                                  className="rounded border-gray-300 text-sm py-1 pl-2 pr-8 focus:border-pink-500 focus:outline-none focus:ring-pink-500"
                                >
                                  {[1, 2, 3, 4 ,5 ,6, 7,8].map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                  ))}
                                </select>
                              </div>
                              
                              <button
                                onClick={e => handleRemove(e, item.id)}
                                className="text-sm font-medium text-red-600 hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Subtotal</span>
                      <span className="text-sm font-medium text-gray-900">${totalAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Shipping</span>
                      <span className="text-sm font-medium text-gray-900">Free</span>
                    </div>
                    
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="text-base font-medium text-gray-900">Total</span>
                      <span className="text-base font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleOrder}
                    disabled={!selectedAddress || !paymentMethod}
                    className={`w-full rounded-lg py-3 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                      !selectedAddress || !paymentMethod 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-pink-400 hover:bg-pink-700'
                    }`}
                  >
                    Place Order
                  </button>
                  
                  <div className="text-center">
                    <Link to="/" className="text-sm font-medium text-pink-600 hover:text-pink-500">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Checkout