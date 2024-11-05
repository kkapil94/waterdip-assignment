export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface BookingData {
  hotel: string;
  arrival_date_year: number;
  arrival_date_month: string;
  arrival_date_day_of_month: number;
  adults: number;
  children: number;
  babies: number;
  country: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ChartDataPoint {
  date: string;
  total: number;
}

export interface CountryDataPoint {
  country: string;
  guests: number;
}

export interface SparklineDataPoint {
  value: number;
  date: string;
}

export interface BookingStat {
  title: string;
  value: string;
  change: string;
  icon?: React.ReactNode;
}
