import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLoggedInUserOrderAsync, selectUserInfo, selectUserOrders } from '../UserSlice';

export default function UserOrders() {
  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    dispatch(fetchLoggedInUserOrderAsync(user.id));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="mt-2 text-gray-600">Review your past purchases and order details</p>
        </div>
        
        {orders.map((order) => (
          <div key={order.id} className="mb-10">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
              {/* Order Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Order #{order.id}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                    order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    order.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-5">
                <ul className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-4">
                      <div className="flex items-start">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        <div className="ml-4 flex-1 min-w-0">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-base font-medium text-gray-900 truncate">
                                {item.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">{item.brand}</p>
                            </div>
                            <p className="ml-4 text-base font-medium text-gray-900">${item.price}</p>
                          </div>
                          
                          <div className="mt-3 flex items-center text-sm text-gray-500">
                            <span className="mr-4">Qty: {item.quantity}</span>
                            <span>Total: ${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Method</h3>
                    <p className="text-sm text-gray-600">{order.paymentMethod || 'Not specified'}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Order Total</h3>
                    <p className="text-lg font-semibold text-gray-900">${order.totalAmount}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Shipping Address</h3>
                  <div className="bg-white rounded-md p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.selectedAddress.name}</p>
                        <p className="text-gray-600 mt-1">{order.selectedAddress.street}</p>
                        <p className="text-gray-600">{order.selectedAddress.city}, {order.selectedAddress.state}</p>
                        <p className="text-gray-600">{order.selectedAddress.pinCode}</p>
                      </div>
                      <div className="md:text-right">
                        <p className="text-gray-900">
                          <span className="font-medium">Phone:</span> {order.selectedAddress.phone}
                        </p>
                        <p className="text-gray-600 mt-1">{order.selectedAddress.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}