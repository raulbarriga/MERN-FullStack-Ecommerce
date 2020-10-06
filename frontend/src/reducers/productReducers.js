import { PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAIL } from '../constants/productConstants'

//a reducer takes in 2 things: an initial state & an action
//when we create an action reducer we're gonna dispatch an action to one of these reducers, respectively 
//action'll be an object that has a type & it might also have a payload

export const productListReducer = (state = {products: []}, action) => {
    //to evaluate the action type, we use a switch:
    switch(action.type) {
        case PRODUCT_LIST_REQUEST: 
            return {
                loading: true,//when we make the request, we want the component to know that it's currently fetching/loading
                products: []
            }
        case PRODUCT_LIST_SUCCESS:
            return {
                loading: false,// b/c it's done loading/making the request
                products: [action.payload]
            }
        case PRODUCT_LIST_FAIL:
                return {
                    loading: false,
                    error: action.payload
                }
        default:
            return state;
    }
}