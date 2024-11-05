import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BookingData, LoadingState } from "@/types/hotel.types";
import { parseCSV } from "@/utils/data";

interface BookingState extends LoadingState {
  data: BookingData[];
}

const initialState: BookingState = {
  data: [],
  isLoading: false,
  error: null,
};

export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async () => {
    const data = await parseCSV();
    return data;
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch bookings";
      });
  },
});

export default bookingSlice.reducer;
