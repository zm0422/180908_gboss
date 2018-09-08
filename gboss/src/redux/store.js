/*
 redux最核心的管理对象store
 */
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import reducers from './reducers'

// 向外暴露一个store对象
export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))