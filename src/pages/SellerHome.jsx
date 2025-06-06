import React from 'react'

import SellerProductList from '../features/seller/components/SellerProductList'
import Navbar from '../features/navbar/Navbar'
const SellerHome = () => {
  return (
    <div>
      <Navbar>
        <SellerProductList></SellerProductList>
      </Navbar>
    </div>
  )
}

export default SellerHome