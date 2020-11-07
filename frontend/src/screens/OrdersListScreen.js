import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { ordersListAction } from "../actions/orderActions";

const OrdersListScreen = ({ history }) => {
  const dispatch = useDispatch();

  //this'll have the same name as the property name in the store.js file in combine reducers
  const ordersList = useSelector((state) => state.ordersList); //this comes from the store.js file
  const { loading, error, orders } = ordersList;

  //this and the if statement in useEffect will be used to redirect if we don't have to proper credentials
  const userLogin = useSelector((state) => state.userLogin); //this comes from the store.js file
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(ordersListAction());
    } else {
      //if not logged in or not an admin, then...
      history.push("/login");
    }
    //so if we're not an admin & try to go to an admin only page, then we'll get redirected & won't be able to access it via an admin url
  }, [dispatch, history, userInfo]);

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((
              order //these orders comes from the state
            ) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                {/* If the order.user exists, then show the order.user.name */}
                <td>{order.user && order.user.name}</td>
                <td>
                  {/* This'll give us the date. */}
                  {order.createdAt.substring(0, 10)}
                </td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrdersListScreen;
