import { useCallback, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "@/types/hotel.types";
import { useAppDispatch } from "@/hooks/redux";
import { setDateRange } from "@/store/slices/dateSlice";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateRangePicker() {
  const dispatch = useAppDispatch();
  const [date, setDate] = useState<DateRange>({
    startDate: new Date(2015, 6, 1), // July 1, 2015
    endDate: new Date(2015, 6, 31),
  });

  const disableDates = (date: any) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Allow only July (6) and August (7) of 2015
    return !(year === 2015 && (month === 6 || month === 7));
  };

  const onDateSelect = useCallback(
    (selectedDate: DateRange) => {
      setDate(selectedDate);
      console.log(selectedDate);

      dispatch(setDateRange(selectedDate));
    },
    [dispatch]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date.startDate ? (
            date.endDate ? (
              <>
                {format(date.startDate, "LLL dd, y")} -{" "}
                {format(date.endDate, "LLL dd, y")}
              </>
            ) : (
              format(date.startDate, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          initialFocus
          mode="range"
          selected={{ from: date.startDate!, to: date.endDate! }}
          disabled={disableDates}
          fromMonth={new Date(2015, 6)} // July 2015
          toMonth={new Date(2015, 7)} // August 2015
          onSelect={(range) =>
            onDateSelect({
              startDate: range?.from ?? null,
              endDate: range?.to ?? null,
            })
          }
        />
      </PopoverContent>
    </Popover>
  );
}
