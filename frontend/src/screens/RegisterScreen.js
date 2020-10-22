import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { register } from "../actions/userActions";

const RegisterScreen = ({ location, history }) => {
  //component level state for the form, w/ an empty string as default
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch()
  const userRegister = useSelector(state => state.userRegister)
  const { loading, error, userInfo } = userRegister//values coming from the user reducer properties



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
    //we need to check confirmed password is equal to the password above it:
    if(password !== confirmPassword) {
        setMessage('Passwords do not match')
    } else {
        //if passwords match, then we dispatch register:
        //This is where we dispatch register
    dispatch(register(name, email, password))
    }
  }

  return (
    <FormContainer>
      <h1>Register</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
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
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type='submit'variant='primary'>Register</Button>
      </Form>
      <Row className='py-3'>
          <Col>
            Already Have An Account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Sign In</Link>
          </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
//after we finish creating the screen, we need to add it via app.js file
//after that, we move to another app functionality: user profile backend