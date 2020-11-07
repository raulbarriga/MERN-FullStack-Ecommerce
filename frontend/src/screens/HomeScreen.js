import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// useDispatch is used to dispatch or call an action
// useSelector is used to select parts of the state, in this case the product list out of the state
import { Col, Row } from "react-bootstrap";

import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";
import ProductCarousel from "../components/ProductCarousel";
import { listProducts } from "../actions/productActions";

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1; //it's always gonna be 1 if there's no specific page number

  //we're using hooks here
  //In the past, we'd use a high order method called connect & map state the props & that was just a pain, hooks makes it much easier to use
  const dispatch = useDispatch();
  //to actually display the products we use useSelector:
  const productsList = useSelector((state) => state.productsList);
  //what do we want from the productList:
  const { loading, error, products, page, pages } = productsList;

  useEffect(() => {
    //listProducts is the action that calls the products from the backend
    dispatch(listProducts(keyword, pageNumber)); //this does the same thing as it did before
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          Back
        </Link>
      )}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
