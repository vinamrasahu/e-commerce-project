import React from 'react'
import FloneNavbar from '../../components/layout/Navbar'
import FloneSlider from '../../components/layout/Sidebar/Sidebar'
import ProductGrid from '../products/ProductGrid'
import MainBlog from '../../components/layout/blog/MainBlog'
import Badges from '../../components/layout/bages/Bages'
import FloneFooter from '../../components/layout/Footer/Footer'

const Home = () => {
  return (
    <div>
    <FloneNavbar/>

    <FloneSlider/>
    <Badges/>
     <ProductGrid/>
     <MainBlog/>
     <FloneFooter/>
    </div>
  )
}

export default Home