import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateRange } from "@/types/hotel.types.ts";

const initialState: DateRange = {
  startDate: null,
  endDate: null,
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
});

export const { setDateRange } = dateSlice.actions;
export default dateSlice.reducer;
