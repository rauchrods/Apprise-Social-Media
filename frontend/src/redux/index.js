import { combineReducers } from "redux";
import authSlice from "./features/authSlice";
const rootReducer = combineReducers({
  auth: authSlice,
  // Add more reducers here if needed
});

export default rootReducer;
