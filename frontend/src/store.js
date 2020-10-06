import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productListReducer } from './reducers/productReducers'

const reducer = combineReducers({
    
})

const initialState = {}// if you want something to be loaded initially when the redux store loads, we can put it in here

const middleware = [thunk]
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))//in applyMiddleware we could just pass in thunk() but we do this instead

export default store