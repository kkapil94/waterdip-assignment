import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { filterBookingsByDateRange, aggregateByCountry } from "@/utils/data";
import { fetchBookings } from "@/store/slices/bookingSlice";

export const ColumnChart = () => {
  const dispatch = useAppDispatch();
  const {
    data: bookings,
    isLoading,
    error,
  } = useAppSelector((state) => state.bookings);
  const dateRange = useAppSelector((state) => state.date);
  const [chartData, setChartData] = useState<
    { country: string; guests: number }[]
  >([]);

  useEffect(() => {
    if (!bookings.length) {
      dispatch(fetchBookings());
    }
  }, [dispatch, bookings.length]);

  useEffect(() => {
    const filteredBookings = filterBookingsByDateRange(bookings, dateRange);
    setChartData(aggregateByCountry(filteredBookings));
  }, [bookings, dateRange]);

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
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="guests" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
