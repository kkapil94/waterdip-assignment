import Papa from "papaparse";
import { BookingData } from "@/types/hotel.types";
import bookingsData from "@/data/hotel_bookings.csv?raw";

export const parseCSV = async (): Promise<BookingData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(bookingsData, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedData = result.data.map((row) => ({
          hotel: row.hotel || "",
          arrival_date_year: parseInt(row.arrival_date_year || "0", 10),
          arrival_date_month: row.arrival_date_month || "",
          arrival_date_day_of_month: parseInt(
            row.arrival_date_day_of_month || "0",
            10
          ),
          adults: parseInt(row.adults || "0", 10),
          children: parseInt(row.children || "0", 10),
          babies: parseInt(row.babies || "0", 10),
          country: row.country || "",
        }));
        resolve(parsedData as BookingData[]);
      },
      error: reject,
    });
  });
};

export const calculateTotals = (bookings: BookingData[] | null | undefined) => {
  if (!bookings || !Array.isArray(bookings)) {
    return {
      adults: 0,
      children: 0,
      babies: 0,
      totalGuests: 0,
      countries: [] as string[],
      totalBookings: 0,
    };
  }

  return bookings.reduce(
    (acc, booking) => {
      acc.adults += booking.adults;
      acc.children += booking.children;
      acc.babies += booking.babies;
      acc.totalGuests += booking.adults + booking.children + booking.babies;
      acc.totalBookings += 1;
      if (!acc.countries.includes(booking.country)) {
        acc.countries.push(booking.country);
      }
      return acc;
    },
    {
      adults: 0,
      children: 0,
      babies: 0,
      totalGuests: 0,
      totalBookings: 0,
      countries: [] as string[],
    }
  );
};
