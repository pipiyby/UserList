import {combineReducers} from 'redux';
import users from './users';
import targetUser from './targetUser';
import filter from './filter';

const reducers = combineReducers({
    users,
    targetUser,
    filter
});

export default reducers;