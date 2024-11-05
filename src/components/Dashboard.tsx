import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchBookings } from "@/store/slices/bookingSlice";

const Dashboard = () => {
  const dispatch = useAppDispatch();
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

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-col md:flex">
        <div className="flex h-16 items-center px-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Resort Hotel Dashboard
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
