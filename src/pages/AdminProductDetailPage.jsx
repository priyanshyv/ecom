import React from 'react'
import Navbar from '../features/navbar/Navbar'
import ProductDetail from '../features/product/components/ProductDetail'
import ProductReview from '../features/product/components/ProductReview'
import AdminProductDetail from '../features/admin/components/AdminProductDetail'

const AdminProductDetailPage = () => {
  return (
    <div>
        <Navbar>
            <AdminProductDetail></AdminProductDetail>
        </Navbar>
    </div>
  )
}

export default AdminProductDetailPage