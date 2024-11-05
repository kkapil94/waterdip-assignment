import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "./slices/dateSlice";
import bookingReducer from "./slices/bookingSlice";

export const store = configureStore({
  reducer: {
    date: dateReducer,
    bookings: bookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
