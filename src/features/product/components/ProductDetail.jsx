'use client'

import { useEffect, useState } from 'react'
import { StarIcon, HeartIcon, ShoppingBagIcon, SparklesIcon } from '@heroicons/react/24/solid'
import { Radio, RadioGroup } from '@headlessui/react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductByIdAsync, selectProductById } from '../ProductSlice'
import { useParams } from 'react-router-dom'
import { addToCartAsync } from '../../cart/CartSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { motion } from 'framer-motion'

const colors = [
  { name: 'White', class: 'bg-white', selectedClass: 'ring-pink-300' },
  { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-pink-300' },
  { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-pink-300' },
]
const sizes = [
  { name: 'XXS', inStock: false },
  { name: 'XS', inStock: true },
  { name: 'S', inStock: true },
  { name: 'M', inStock: true },
  { name: 'L', inStock: true },
  { name: 'XL', inStock: true },
  { name: '2XL', inStock: true },
  { name: '3XL', inStock: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [selectedSize, setSelectedSize] = useState(sizes[2]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const user = useSelector(selectLoggedInUser);
  const product = useSelector(selectProductById);
  const dispatch = useDispatch();
  const params = useParams();
  
  const handleCart = (e) => {
    e.preventDefault();
    const newItem = {...product,quantity:1,user:user.id};
    delete newItem['id'];
    dispatch(addToCartAsync(newItem));
  }
  
  useEffect(() => {
    dispatch(fetchProductByIdAsync(params.id));
  }, [dispatch, params.id])

  const showSizeAndColor = ['clothing', 'shoes', 'apparel', 'fashion'].includes(product?.category?.toLowerCase());

  return (
    <div className="bg-white min-h-screen">
      {product && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-6"
        >
          {/* Main Product Container */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Image Gallery */}
              <div className="w-full lg:w-1/2">
                <div className="flex flex-col-reverse lg:flex-row gap-6">
                  {/* Thumbnail images */}
                  <div className="hidden lg:flex flex-col gap-4 w-20">
                    {product.images.slice(0, 4).map((image, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentImage(index)}
                        className={`rounded-lg overflow-hidden border-2 ${currentImage === index ? 'border-pink-300' : 'border-transparent'}`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Main image */}
                  <div 
                    className="relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <motion.img
                      src={product.images[currentImage]}
                      alt={product.title}
                      className="w-full h-full object-contain p-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      key={currentImage}
                    />
                    
                    <motion.button 
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-pink-50 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <HeartIcon className={`w-6 h-6 ${isFavorite ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}`} />
                    </motion.button>
                    
                    {product.discountPercentage && (
                      <motion.div 
                        className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <SparklesIcon className="w-4 h-4 text-amber-200" />
                        <span>{product.discountPercentage}% OFF</span>
                      </motion.div>
                    )}
                    
                    {isHovering && (
                      <motion.div 
                        className="absolute bottom-4 left-0 right-0 flex justify-center"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                      >
                        <div className="flex gap-2">
                          {product.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImage(index)}
                              className={`w-2 h-2 rounded-full ${currentImage === index ? 'bg-pink-500' : 'bg-gray-300'}`}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="w-full lg:w-1/2">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="sticky top-6"
                >
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900 mb-2 font-serif tracking-tight">{product.title}</h1>
                      <p className="text-amber-600 font-medium flex items-center gap-2">
                        <span className="bg-amber-100 px-2 py-1 rounded-md text-sm">{product.brand}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-500 text-sm">{product.category}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            aria-hidden="true"
                            className={classNames(
                              product.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                              'w-5 h-5 flex-shrink-0',
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews?.length || 0} reviews)</span>
                      <span className="text-sm text-pink-500 font-medium">#{product.sku}</span>
                    </div>

                    <div className="flex items-baseline gap-3 mt-4">
                      <p className="text-4xl font-bold text-gray-900">${product.price}</p>
                      {product.discountPercentage && (
                        <span className="text-lg text-gray-500 line-through">
                          ${(product.price + (product.price * product.discountPercentage / 100)).toFixed(2)}
                        </span>
                      )}
                      {product.discountPercentage && (
                        <span className="text-sm font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-md">
                          Save {product.discountPercentage}%
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.availabilityStatus === 'In Stock' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock} {product.availabilityStatus}
                      </span>
                      {product.minimumOrderQuantity && (
                        <span className="text-sm text-gray-500">
                          Min. order: {product.minimumOrderQuantity}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 leading-relaxed mt-4">{product.description}</p>
                  </div>

                  {/* Options */}
                  <form className="mt-8 space-y-6">
                    {showSizeAndColor && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                          <RadioGroup value={selectedColor} onChange={setSelectedColor} className="flex items-center gap-3">
                            {colors.map((color) => (
                              <Radio 
                                key={color.name}
                                value={color}
                                aria-label={color.name}
                                className={({ checked }) => classNames(
                                  color.class,
                                  checked ? color.selectedClass : '',
                                  'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ring-2 ring-transparent transition-all'
                                )}
                              >
                                {({ checked }) => (
                                  <>
                                    <span
                                      aria-hidden="true"
                                      className={classNames(
                                        color.class,
                                        'h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center'
                                      )}
                                    />
                                    {checked && (
                                      <motion.span 
                                        className="absolute -inset-0.5 rounded-full border-2 border-amber-500"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                      />
                                    )}
                                  </>
                                )}
                              </Radio>
                            ))}
                          </RadioGroup>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">Size</h3>
                            <button type="button" className="text-sm font-medium text-pink-500 hover:text-pink-600">
                              Size guide
                            </button>
                          </div>
                          <RadioGroup
                            value={selectedSize}
                            onChange={setSelectedSize}
                            className="grid grid-cols-4 gap-3 mt-3"
                          >
                            {sizes.map((size) => (
                              <Radio
                                key={size.name}
                                value={size}
                                disabled={!size.inStock}
                                className={({ checked }) => classNames(
                                  size.inStock
                                    ? 'bg-white text-gray-900 shadow-xs hover:bg-gray-50'
                                    : 'bg-gray-50 text-gray-200 cursor-not-allowed',
                                  checked ? 'ring-2 ring-amber-500 bg-amber-50' : '',
                                  'group relative flex items-center justify-center rounded-md py-3 px-4 text-sm font-medium uppercase focus:outline-none transition-all'
                                )}
                              >
                                {({ checked }) => (
                                  <>
                                    <span>{size.name}</span>
                                    {checked && (
                                      <motion.span 
                                        className="absolute -inset-0.5 rounded-md border-2 border-amber-500"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                      />
                                    )}
                                    {!size.inStock && (
                                      <span
                                        aria-hidden="true"
                                        className="absolute inset-0 flex items-center justify-center"
                                      >
                                        <svg className="h-full w-full stroke-2 text-gray-200" viewBox="0 0 100 100" preserveAspectRatio="none">
                                          <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" />
                                        </svg>
                                      </span>
                                    )}
                                  </>
                                )}
                              </Radio>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                    <motion.button
  onClick={handleCart}
  whileHover={{ scale: 1.01 }}
  whileTap={{ scale: 0.99 }}
  className="w-full flex items-center justify-center rounded-md bg-pink-500 px-6 py-3 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-colors"
>
  <ShoppingBagIcon className="w-5 h-5 mr-2 text-pink-100" />
  Add to cart
</motion.button>

                      
                    </div>
                  </form>

                  {/* Product details */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {product.weight && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Weight</p>
                          <p className="text-sm text-gray-900">{product.weight} oz</p>
                        </div>
                      )}
                      {product.dimensions && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Dimensions</p>
                          <p className="text-sm text-gray-900">
                            {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} cm
                          </p>
                        </div>
                      )}
                      {product.warrantyInformation && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Warranty</p>
                          <p className="text-sm text-gray-900">{product.warrantyInformation}</p>
                        </div>
                      )}
                      {product.shippingInformation && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Shipping</p>
                          <p className="text-sm text-gray-900">{product.shippingInformation}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Return policy */}
                  {product.returnPolicy && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-pink-50 rounded-lg border border-amber-100">
                      <h4 className="text-sm font-medium text-amber-800 flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4 text-amber-500" />
                        <span>Return Policy</span>
                      </h4>
                      <p className="mt-1 text-sm text-amber-700">{product.returnPolicy}</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Reviews section */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="mt-16 border-t border-gray-200 pt-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h3>
                <div className="space-y-8">
                  {product.reviews.map((review, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="pb-6 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              aria-hidden="true"
                              className={classNames(
                                review.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                                'w-5 h-5 flex-shrink-0',
                              )}
                            />
                          ))}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{review.reviewerName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}