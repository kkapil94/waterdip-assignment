import Papa from "papaparse";
import {
  BookingData,
  DateRange,
  SparklineDataPoint,
  BookingStat,
} from "@/types/hotel.types";
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

export const filterBookingsByDateRange = (
  bookings: BookingData[],
  dateRange: DateRange
): BookingData[] => {
  if (!dateRange.startDate || !dateRange.endDate) return bookings;

  return bookings.filter((booking) => {
    const bookingDate = new Date(
      booking.arrival_date_year,
      new Date(`1 ${booking.arrival_date_month} 2000`).getMonth(),
      booking.arrival_date_day_of_month
    );
    return (
      bookingDate >= dateRange.startDate! && bookingDate <= dateRange.endDate!
    );
  });
};

export const aggregateByCountry = (bookings: BookingData[]) => {
  return bookings.reduce((acc, booking) => {
    const existingCountry = acc.find(
      (item) => item.country === booking.country
    );
    if (existingCountry) {
      existingCountry.guests += 1;
    } else {
      acc.push({
        country: booking.country,
        guests: 1,
      });
    }
    return acc;
  }, [] as { country: string; guests: number }[]);
};

export const getTrendData = (
  bookings: BookingData[],
  metric: "adults" | "children" | "country"
): SparklineDataPoint[] => {
  const aggregated = bookings.reduce((acc, booking) => {
    const date = `${booking.arrival_date_month} ${booking.arrival_date_day_of_month}`;
    if (!acc[date]) {
      acc[date] = 0;
    }

    switch (metric) {
      case "adults":
        acc[date] += booking.adults;
        break;
      case "children":
        acc[date] += booking.children;
        break;
      case "country":
        acc[date] = new Set([
          ...(acc[date] ? [acc[date]] : []),
          booking.country,
        ]).size;
        break;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(aggregated)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const calculatePercentageChange = (
  current: number,
  previous: number
): string => {
  if (previous === 0) return "+100%";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
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

export const calculateStats = (
  currentBookings: BookingData[],
  previousBookings: BookingData[]
): BookingStat[] => {
  const current = calculateTotals(currentBookings);
  const previous = calculateTotals(previousBookings);

  return [
    {
      title: "Total Bookings",
      value: currentBookings.length.toString(),
      change: calculatePercentageChange(
        currentBookings.length,
        previousBookings.length
      ),
    },
    {
      title: "Total Guests",
      value: current.totalGuests.toString(),
      change: calculatePercentageChange(
        current.totalGuests,
        previous.totalGuests
      ),
    },
    {
      title: "Children",
      value: current.children.toString(),
      change: calculatePercentageChange(current.children, previous.children),
    },
    {
      title: "Countries",
      value: current.countries.length.toString(),
      change: calculatePercentageChange(
        current.countries.length,
        previous.countries.length
      ),
    },
  ];
};
