//There's only gonna be 1 cart reducer but we still name it in plural to keep the naming convention
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
        //we also have to handle the case where if we click add to cart & the item already exists in the cart
        const item = action.payload
        //if the item exists
        const existItem = state.cartItems.find(x => x.product === item.product)// for each of the items in the current state cart items
        if (existItem) {
            return {
                ...state,// x.product & existItem.product are both the id of a product, if the item matches the id, then we return the item(s) matched
                cartItems: state.cartItems.map(x => x.product === existItem.product ? item : x )
            }
        } else {
            //if it doesn't exist, we're just gonna push it to the array
            return {
                ...state,
                cartItems: [...state.cartItems, item]
            }
        }   
    case CART_REMOVE_ITEM:
        return {
            ...state,
            cartItems: state.cartItems.filter(x => x.product !== action.payload)
        }
    default:
      return state;
  }
};
