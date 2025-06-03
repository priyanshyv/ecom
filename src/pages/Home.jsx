import React from 'react'
import Navbar from '../features/navbar/Navbar'
import ProductList from '../features/product/components/ProductList'
import Footer from './Footer'
const Home = () => {
  return (
    <div className='bg-pink-50'>
      <Navbar>
        <ProductList></ProductList>
      </Navbar>
      <Footer></Footer>
    </div>
  )
}

export default Home
