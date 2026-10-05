import React from 'react'
import FloneNavbar from '../../components/layout/Navbar'
import Product from './Product'
import ProductGrid from './ProductGrid'
import Shop from './Shop'
import FloneFooter from '../../components/layout/Footer/Footer'
import PromoBannerCarousel from './PromoBannerCarousel'

const ProductDetail = () => {
  return (
    <div>
      <FloneNavbar/>
      <PromoBannerCarousel/>
     <Shop/>
     <FloneFooter/>
    </div>
  )
}

export default ProductDetail