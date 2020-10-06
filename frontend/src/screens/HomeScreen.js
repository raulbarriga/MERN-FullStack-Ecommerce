import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import axios from 'axios'

import Product from '../components/Product'


const HomeScreen = () => {
  //you pass 1) what you want to call this piece of state and
  // 2) what you want to call the function to manipulate/change the state
  const [products, setProducts] = useState([])//in parentheses you pass the default, empty array in this case for products

  //w/ this you make a request to the backend
  useEffect(() => {
    //takes in an arrow function & whatever you put in here is gonna run as soon as the component loads
    //we want the products as soon as the component loads so this is what you use to make that request

    // if you'd want to use .then promises
    // axios.get('/api/products').then()
    
    //but I'm gonna use async/await. But I cant place async in front of the useEffect arrow function, I have to create a separate function w/i useEffect:
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products')
      //res has a .data object property but we can destructure it instead

      //here we set the data that we get back to the empty array from useState:
      setProducts(data)
    }
    //now we just have to call to fetch the products:
    fetchProducts()
  //the 2nd argument for useEffect is an array of dependancies (anything that you want to fire useEffect off when it changes)
  }, [])// finally, we need a proxy on the frontend package.json to connect the server to the frontend localhost:3000

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map(product => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
