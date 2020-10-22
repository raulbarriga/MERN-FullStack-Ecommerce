import React from "react";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
//import OutsideClickHandler from "react-outside-click-handler";
import { logout } from "../actions/userActions";
import { OutsideClickHandler } from './OutsideClickHandler'

const Header = ({ history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const { visible, setVisible, ref } = OutsideClickHandler(false);

  const handleClick = () => {
    setVisible(prevState => !prevState)
  };
  
  const keyPressHandler = (event) => {
    if(event.key === 'Escape') setVisible(false)
}    

  const logoutHandler = () => {
    dispatch(logout());
    //where ever we log out, we'll be redirected to the login page
    history.push("/login");
  };
// 
// 
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand href="/">Proshop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle id='nav-toggle-btn' aria-controls="basic-navbar-nav" onClick={handleClick} onKeyDown={keyPressHandler} />
          { visible && (
            <Navbar.Collapse id="basic-navbar-nav" ref={ref}>
              <Nav className="ml-auto">
                <LinkContainer to="/cart">
                  <Nav.Link>
                    <i className="fas fa-shopping-cart"></i> Cart
                  </Nav.Link>
                </LinkContainer>
                {userInfo ? ( //if you're logged in, this'll show
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Sign Out
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  //if you're not logged in, this'll show
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <i className="fas fa-user"></i> Sign In
                    </Nav.Link>
                  </LinkContainer>
                )}
                {/* This below is like an if statement, only if the first 2 are true will the last thing get shown */}
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="admin" id="adminmenu">
                    <LinkContainer to="/admin/userslist">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/productslist">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orderslist">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          ) }
          
        </Container>
      </Navbar>
    </header>
  );
};

export default withRouter(Header);
