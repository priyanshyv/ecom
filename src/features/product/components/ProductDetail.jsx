'use client'

import { useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { Radio, RadioGroup } from '@headlessui/react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductByIdAsync, selectProductById } from '../ProductSlice'
import { useParams } from 'react-router-dom'
import { addToCartAsync } from '../../cart/CartSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'

const colors = [
  { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
  { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
  { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
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

  // Categories where we should show size and color options
  const showSizeAndColor = ['clothing', 'shoes', 'apparel', 'fashion'].includes(product?.category?.toLowerCase());

  return (
    <div className="bg-white">
      {product && <div className="pt-6">
        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <img
            alt={product.title}
            src={product.images[0]}
            className="hidden size-full rounded-lg object-cover lg:block"
          />
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <img
              alt={product.title}
              src={product.images[1]||product.images[0]}
              className="aspect-3/2 w-full rounded-lg object-cover"
            />
            <img
              alt={product.title}
              src={product.images[2] ||product.images[0]}
              className="aspect-3/2 w-full rounded-lg object-cover"
            />
          </div>
          <img
            alt={product.title}
            src={product.images[3] || product.images[0]}
            className="aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-auto"
          />
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.title}</h1>
            <p className="mt-2 text-sm text-gray-500">SKU: {product.sku}</p>
            <p className="mt-2 text-sm text-gray-500">Brand: {product.brand}</p>
            <p className="mt-2 text-sm text-gray-500">Category: {product.category}</p>
            {product.tags && product.tags.length > 0 && (
              <p className="mt-2 text-sm text-gray-500">Tags: {product.tags.join(', ')}</p>
            )}
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <div className="flex items-center gap-4">
              <p className="text-3xl tracking-tight text-gray-900">${product.price}</p>
              {product.discountPercentage && (
                <span className="text-sm text-gray-500 line-through">
                  ${(product.price + (product.price * product.discountPercentage / 100)).toFixed(2)}
                </span>
              )}
              {product.discountPercentage && (
                <span className="text-sm font-medium text-green-600">
                  {product.discountPercentage}% off
                </span>
              )}
            </div>

            {/* Reviews */}
            <div className="mt-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        product.rating > rating ? 'text-gray-900' : 'text-gray-200',
                        'size-5 shrink-0',
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">{product.rating} out of 5 ({product.reviews?.length || 0} reviews)</p>
              </div>
            </div>

            <div className="mt-4">
              <p className={`text-sm font-medium ${product.availabilityStatus === 'In Stock' ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock} {product.availabilityStatus}
              </p>
              {product.minimumOrderQuantity && (
                <p className="mt-1 text-sm text-gray-500">Minimum order quantity: {product.minimumOrderQuantity}</p>
              )}
            </div>

            <form className="mt-10">
              {/* Colors - only show for certain categories */}
              {showSizeAndColor && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>
                  <fieldset aria-label="Choose a color" className="mt-4">
                    <RadioGroup value={selectedColor} onChange={setSelectedColor} className="flex items-center gap-x-3">
                      {colors.map((color) => (
                        <Radio 
                          key={color.name}
                          value={color}
                          aria-label={color.name}
                          className={classNames(
                            color.selectedClass,
                            'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-hidden data-checked:ring-2 data-focus:data-checked:ring-3 data-focus:data-checked:ring-offset-1',
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(color.class, 'size-8 rounded-full border border-black/10')}
                          />
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div>
              )}

              {/* Sizes - only show for certain categories */}
              {showSizeAndColor && (
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Size guide
                    </a>
                  </div>
                  <fieldset aria-label="Choose a size" className="mt-4">
                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                    >
                      {sizes.map((size) => (
                        <Radio
                          key={size.name}
                          value={size}
                          disabled={!size.inStock}
                          className={classNames(
                            size.inStock
                              ? 'cursor-pointer bg-white text-gray-900 shadow-xs'
                              : 'cursor-not-allowed bg-gray-50 text-gray-200',
                            'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-hidden data-focus:ring-2 data-focus:ring-indigo-500 sm:flex-1 sm:py-6',
                          )}
                        >
                          <span>{size.name}</span>
                          {size.inStock ? (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-md border-2 border-transparent group-data-checked:border-indigo-500 group-data-focus:border"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                            >
                              <svg
                                stroke="currentColor"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                className="absolute inset-0 size-full stroke-2 text-gray-200"
                              >
                                <line x1={0} x2={100} y1={100} y2={0} vectorEffect="non-scaling-stroke" />
                              </svg>
                            </span>
                          )}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div>
              )}
{/* <Link 
              to="/checkout"
              className="flex items-center justify-center rounded-md border border-transparent bg-pink-100 px-6 py-3 text-base font-medium text-pink-700 shadow-sm hover:bg-pink-200 transition-colors duration-150 w-full"
            >
              Checkout
            </Link> */}
              <button
                onClick={handleCart}
                type="submit"
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent  bg-pink-100 px-8 py-3 text-base font-medium text-pink-700 hover:bg-pink-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
              >
                Add to cart
              </button>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
            {/* Description and details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <div className="mt-4 space-y-6">
                <p className="text-base text-gray-900">{product.description}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {product.weight && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Weight</p>
                      <p className="text-sm text-gray-600">{product.weight} oz</p>
                    </div>
                  )}
                  {product.dimensions && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dimensions</p>
                      <p className="text-sm text-gray-600">
                        {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} cm
                      </p>
                    </div>
                  )}
                  {product.warrantyInformation && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Warranty</p>
                      <p className="text-sm text-gray-600">{product.warrantyInformation}</p>
                    </div>
                  )}
                  {product.shippingInformation && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Shipping</p>
                      <p className="text-sm text-gray-600">{product.shippingInformation}</p>
                    </div>
                  )}
                  {product.returnPolicy && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Return Policy</p>
                      <p className="text-sm text-gray-600">{product.returnPolicy}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {product.reviews && product.reviews.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
                <div className="mt-4 space-y-6">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              aria-hidden="true"
                              className={classNames(
                                review.rating > rating ? 'text-gray-900' : 'text-gray-200',
                                'size-4 shrink-0',
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-sm font-medium text-gray-900">{review.reviewerName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.meta && (
              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {product.meta.barcode && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">Barcode</p>
                        <p className="text-sm text-gray-600">{product.meta.barcode}</p>
                      </div>
                    )}
                    {product.meta.createdAt && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">Created At</p>
                        <p className="text-sm text-gray-600">
                          {new Date(product.meta.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>}
    </div>
  )
}