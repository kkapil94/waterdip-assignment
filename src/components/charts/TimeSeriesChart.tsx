import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { filterBookingsByDateRange } from "@/utils/data";
import { fetchBookings } from "@/store/slices/bookingSlice";
import { BookingData } from "@/types/hotel.types";

export const TimeSeriesChart = () => {
  const dispatch = useAppDispatch();
  const {
    data: bookings,
    isLoading,
    error,
  } = useAppSelector((state) => state.bookings);
  const dateRange = useAppSelector((state) => state.date);
  const [chartData, setChartData] = useState<BookingData[]>([]);

  useEffect(() => {
    if (bookings.length === 0) {
      dispatch(fetchBookings());
    } else {
      const filteredBookings = filterBookingsByDateRange(bookings, dateRange);
      setChartData(filteredBookings);
    }
  }, [dispatch, bookings, dateRange]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="adults"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
