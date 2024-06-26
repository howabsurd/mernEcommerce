import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "./Products.css"
import {useSelector , useDispatch} from "react-redux";
import {clearErrors , getProduct} from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from 'react-js-pagination';

const Products = () => {
  const params = useParams();
  const {keyword} = params;

  const [currentPage , setCurrentPage]  =  useState(1);

  const setCurrentPageNo = (e)=>{
    setCurrentPage(e)
  }

  const dispatch = useDispatch();

  const { loading, error, products, productsCount, resultPerPage} = useSelector((state) => state.products)

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage));
  }, [dispatch, alert, keyword, currentPage]);


  return (
    <Fragment>
      {loading ? <Loader /> : <Fragment>
        
        <h2 className='productsHeading'>Products</h2>
        
        <div className='products'>
        {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>

        { resultPerPage < productsCount && (<div className='paginationBox'>
          <Pagination activePage={currentPage} itemsCountPerPage={resultPerPage} totalItemsCount={productsCount} onChange={setCurrentPageNo} nextPageText="Next" prevPageText="Prev" firstPageText="1st" lastPageText="Last" itemClass='page-item' linkClass='page-link' activeClass='pageItemActive' activeLinkClass='pageLinkActive'/>
        </div>)}
        
        </Fragment>}
    </Fragment>

  )
}

export default Products