import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteItemFromCartAsync,
  selectItems,
  updateCartAsync
} from './CartSlice';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaArrowRight } from 'react-icons/fa';

export default function Cart() {
  const items = useSelector(selectItems);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const totalAmount = items.reduce((amount,item)=>item.price*item.quantity+amount,0);
  const totalItems = items.reduce((total,item)=>item.quantity+total,0);

  const handleQuantity = (e,item)=>{
    dispatch(updateCartAsync({...item,quantity: +e.target.value}));
  };

  const handleRemove = (e,id)=>{
    dispatch(deleteItemFromCartAsync(id))
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const buttonHover = {
    scale: 1.02,
    transition: { duration: 0.2 }
  };

  const buttonTap = {
    scale: 0.98
  };

  return (
    <>
      {items.length==0 && <Navigate to='/' replace={true}></Navigate>}
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 bg-white border-b">
              <h1 className='text-3xl font-bold text-gray-900'>
                Your Shopping Bag
                <span className="ml-3 text-pink-600 bg-pink-100 px-3 py-1 rounded-full text-sm align-middle">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </h1>
            </div>

            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-700">Products</h2>
                <span className="text-sm text-gray-500">Price</span>
              </div>
            </div>

            <motion.ul 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-gray-200"
            >
              <AnimatePresence>
                {items.map((item) => (
                  <motion.li 
                    key={item.id} 
                    variants={itemVariants}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="size-24 shrink-0 overflow-hidden rounded-lg border border-gray-200"
                        >
                          <img 
                            alt={item.title} 
                            src={item.thumbnail} 
                            className="size-full object-cover object-center" 
                          />
                        </motion.div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={e=>handleRemove(e,item.id)}
                          className="absolute -top-2 -right-2 bg-pink-600 text-white p-1 rounded-full shadow-sm"
                        >
                          <FaTrash size={12} />
                        </motion.button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link 
                        // yaha yei iss wajah sey work nahi karra kyuki cart mei jaakey iski id change ho gayi
                          // to={`/product-detail/${item.id}`}
                          className="text-lg font-medium text-gray-900 hover:text-pink-600 transition-colors duration-200 truncate block"
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm text-gray-500">{item.brand}</p>
                        
                        <div className="mt-3 flex items-center">
                          <div className="flex items-center">
                            <label htmlFor="quantity" className="mr-2 text-sm text-gray-700">
                              Qty:
                            </label>
                            <motion.select 
                              onChange={(e)=>handleQuantity(e,item)} 
                              value={item.quantity}
                              whileFocus={{ scale: 1.02 }}
                              className="rounded-md border border-gray-300 py-1 px-2 text-sm focus:ring-pink-500 focus:border-pink-500 bg-white"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </motion.select>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>

            <div className="p-6 bg-gray-50 border-t">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-pink-600">${totalAmount.toFixed(2)}</span>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">Taxes calculated at checkout</p>
              </div>

              <motion.div 
                whileHover={buttonHover}
                whileTap={buttonTap}
                className="mt-6"
              >
                <Link 
                  to="/checkout"
                  className="flex items-center justify-center rounded-lg bg-pink-100 px-6 py-3 text-pink-700 font-medium hover:bg-pink-200 transition-colors duration-200 w-full"
                >
                  Checkout ${totalAmount.toFixed(2)}
                </Link>
              </motion.div>

              <div className="mt-4 flex justify-center">
                <motion.div
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  <Link to="/">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="text-pink-600 hover:text-pink-800 font-medium flex items-center transition-colors duration-200"
                    >
                      Continue Shopping
                      <FaArrowRight className="ml-2" />
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}