import React from 'react'
import Navbar from '../features/navbar/Navbar'
import SellerProductDetail from '../features/seller/components/SellerProductDetail'

const SellerProductDetailPage = () => {
  return (
    <div>
        <Navbar>
            <SellerProductDetail></SellerProductDetail>
        </Navbar>
    </div>
  )
}

export default SellerProductDetailPage