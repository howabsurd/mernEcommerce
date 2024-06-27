import React, { Fragment, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import "./Products.css"
import {useSelector , useDispatch} from "react-redux";
import {clearErrors , getProduct} from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";

const Products = () => {
  const params = useParams();
  const {keyword} = params

  const dispatch = useDispatch();

  const { loading, error, products, productsCount } = useSelector((state) => state.products)

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword));
  }, [dispatch, alert, keyword]);

  useEffect(()=>{
    console.log(products.length);
  },[products])



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
        
        </Fragment>}
    </Fragment>

  )
}

export default Products