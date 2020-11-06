import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const SearchBox = ({ history }) => {
  //since this search box'll be in the header, we won't have access to props.history so we'll use something called a render prop
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault(); //since we have a form, we do this
    if (keyword.trim()) {
      //.trim is to trim any white space
      history.push(`/search/${keyword}`); //this'll go to search/whatever that keyword is
    } else {
      history.push("/"); //if there's no keyword, then we'll just push to the homepage
    }
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search Products..."
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
