import React from 'react'
import Navbar from '../features/navbar/Navbar'

import SellerProductForm from '../features/seller/components/SellerProductForm'

const SellerProductFormPage = () => {
  return (
    <div>
        <Navbar>
            <SellerProductForm></SellerProductForm>
        </Navbar>
    </div>
  )
}

export default SellerProductFormPage