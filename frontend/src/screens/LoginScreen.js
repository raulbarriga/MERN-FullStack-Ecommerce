import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";

const LoginScreen = ({ location, history }) => {
  //component level state for the form, w/ an empty string as default
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch()
  const userLogin = useSelector(state => state.userLogin)
  const { loading, error, userInfo } = userLogin//values coming from the user reducer properties



  //this'll have the url query string
  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
      if (userInfo) {
          //if we're not logged in, it's gonna be null
          //but if userInfo exists(if we're logged in), then
          history.push(redirect)
      }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    //This is where we dispatch login
    dispatch(login(email, password))
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type='submit'variant='primary'>Sign In</Button>
      </Form>
      <Row className='py-3'>
          <Col>
            New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
          </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
