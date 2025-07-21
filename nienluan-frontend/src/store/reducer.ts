import {combineReducers} from 'redux';
import notificationReducer from './noti/slice';

const rootReducer = combineReducers({
    notification: notificationReducer,
});

export default rootReducer;
