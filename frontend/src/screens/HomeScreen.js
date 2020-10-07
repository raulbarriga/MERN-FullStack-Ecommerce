import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// useDispatch is used to dispatch or call an action
// useSelector is used to select parts of the state, in this case the product list out of the state
import { Col, Row } from "react-bootstrap";

import Product from "../components/Product";
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProducts } from "../actions/productActions";

const HomeScreen = () => {
  //we're using hooks here
  //In the past, we'd use a high order method called connect & map state the props & that was just a pain, hooks makes it much easier to use
  const dispatch = useDispatch();
  //to actually display the products we use useSelector:
  const productList = useSelector((state) => state.productList);
  //what do we want from the productList:
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts()); //this does the same thing as it did before
  }, [dispatch]);

  return (
    <>
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;
