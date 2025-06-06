import React from 'react'
import Navbar from '../features/navbar/Navbar'
import ProductDetail from '../features/product/components/ProductDetail'
import ProductReview from '../features/product/components/ProductReview'

const ProductDetailPage = () => {
  return (
    <div className='bg-pink-50'>
        <Navbar>
            <ProductDetail></ProductDetail>
            {/* review ko page ko dynamic bana na pending hai */}
            {/* <ProductReview></ProductReview> */}
        </Navbar>
    </div>
  )
}

export default ProductDetailPage