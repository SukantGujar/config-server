import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

import actions from './actions';

const 
store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export {store, actions};