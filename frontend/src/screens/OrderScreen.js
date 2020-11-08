import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { Link } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay); //we get this destructured stuff from the orderReducer
  const { loading: loadingPay, success: successPay } = orderPay; //we rename loading & success

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    order.itemsPrice = addDecimals(
      order.orderItems.reduce(
        (accum, currItem) => accum + currItem.price * currItem.qty,
        0
      )
    );
  }

  useEffect(() => {
    //before we do anything, we just make sure we're logged in:
    if (!userInfo) {
      history.push("/login");
    }
    //here we dynamically add the PayPal script to the body
    const addPayPalScript = async () => {
      //fetching the client id from the backend .env file
      const { data: clientId } = await axios.get("/api/config/paypal");
      //this is just vanilla JavaScript
      const script = document.createElement("script");
      script.type = "text/javascript";
      //this comes from the developer.paypal website
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      //we're gonna have a piece of state for when the sdk that paypal'll give us is ready
      script.onload = () => {
        setSdkReady(true); //this tells us if the script has been loaded
      };
      //here we add the script to the body
      document.body.appendChild(script);
    };

    if (!order || order._id !== orderId || successPay || successDeliver) {
      //we can just dispatch here as well (not in the actions file)
      //if we don't reset once you pay, it's just gonna keep refreshing in a loop
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });

      //***this if block is to basically just reset the screen***
      dispatch(getOrderDetails(orderId)); //if successPay is true, it'll load the this dispatch again but now it should be paid
    } else if (!order.isPaid) {
      //if it's not paid, then we call the paypal script w/ addPayPalScript()
      if (!window.paypal) {
        //also checking if the paypal script is there & added to the document.body
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, history, userInfo, order, orderId, successPay, successDeliver]);

  //from paypal, this handler takes in a paymentResult
  const successPaymentHandler = (paymentResult) => {
    //this is where we want to call the payorder action that we created
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult)); //once we pay it, it'll update the database to paid
    //then in the useEffect, after it's paid, successPay should be true & it should dispatch orderDetails to update to paid
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order ID#: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto: ${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {/* Similar to the place order screen, instead of this stuff coming from the cart,
                  here it'll come from the database */}
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
              {/* Payment method is gonna be saved to local storage like the shipping address is, 
                we can add that if we want to in the action creator, but he says there's really no need 
                to have that. Thus, w/o local storage right now, if you reload the page, the payment 
                method'll go away. */}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {/* need to check to make sure there's items in our cart */}
              {order.orderItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {/* here we place all our cart items */}
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={3}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Checking to see if the order isn't paid yet */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {/* Check if it's loading */}
                  {loadingPay && <Loader />}
                  {/* Show a Loader if sdk isn't ready */}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton // if the sdk is readey then we show the PayPal button, it takes 2 attributes, amount & onSuccess handler
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {/* !order.isDelivered checks if it's not delivered */}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
