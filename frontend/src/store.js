import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productDetailsReducer, productListReducer } from './reducers/productReducers'

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer
})//having different reducers helps debug

const initialState = {}// if you want something to be loaded initially when the redux store loads, we can put it in here

const middleware = [thunk]
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))//in applyMiddleware we could just pass in thunk() but we do this instead

export default store
//after you place the reducer you created in the store, go to the action creators to work on that