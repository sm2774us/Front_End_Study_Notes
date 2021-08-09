import { combineReducers } from 'redux'
import colonyReducer from '../features/colonySlice'

export default combineReducers({
  colony: colonyReducer,
})