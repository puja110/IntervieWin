import {combineReducers} from 'redux';
import {chatSlice} from './reducers/chatSlice';

const rootReducer = combineReducers({
  chat: chatSlice.reducer,
});

export default rootReducer;
