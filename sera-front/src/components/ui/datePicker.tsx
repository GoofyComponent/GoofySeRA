import { CalendarIcon } from "lucide-react";

import { cn, convertDateFromDateType } from "@/lib/utils";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export const DatePicker = ({ date, setDate, hideToday = false }: any) => {
  const today = new Date();

  if (hideToday) {
    today.setDate(today.getDate() + 1);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? convertDateFromDateType(date) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          disabled={{ before: today }}
        />
      </PopoverContent>
    </Popover>
  );
};
