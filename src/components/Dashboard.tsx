import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/common/DateRangePicker";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { ColumnChart } from "@/components/charts/ColumnChart";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { fetchBookings } from "@/store/slices/bookingSlice";
import {
  filterBookingsByDateRange,
  getTrendData,
  calculateStats,
} from "@/utils/data";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const dateRange = useAppSelector((state) => state.date);
  const {
    data: bookings,
    isLoading,
    error,
  } = useAppSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredBookings = filterBookingsByDateRange(bookings, dateRange);
  const previousDateRange = {
    startDate:
      dateRange.startDate &&
      new Date(dateRange.startDate.getTime() - 30 * 24 * 60 * 60 * 1000),
    endDate:
      dateRange.endDate &&
      new Date(dateRange.endDate.getTime() - 30 * 24 * 60 * 60 * 1000),
  };

  const previousBookings = filterBookingsByDateRange(
    bookings,
    previousDateRange
  );
  const stats = calculateStats(filteredBookings, previousBookings);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Resort Hotel Dashboard
            </h2>
          </div>
        </div>

        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
            <div className="flex items-center space-x-2">
              <DateRangePicker />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change} from previous period
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Daily Bookings</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <TimeSeriesChart />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Guests by Country</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ColumnChart />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Adults per Booking Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <SparklineChart
                  data={getTrendData(filteredBookings, "adults")}
                  color="#10B981"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Children per Booking Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <SparklineChart
                  data={getTrendData(filteredBookings, "children")}
                  color="#6366F1"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Bookings by Country Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <SparklineChart
                  data={getTrendData(filteredBookings, "country")}
                  color="#F43F5E"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
