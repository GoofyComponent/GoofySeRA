import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { axios } from "@/lib/axios";

import { TicketsTable } from "../tickets/ticketsTable";

export const RecentTicketTable = () => {
  const recentTicket = useQuery({
    queryKey: ["recentTicket"],
    queryFn: async () => {
      const tickets = await axios.get(
        `api/projects-requests?page=1&status=pending&maxPerPage=4&sort=desc`
      );
      return tickets.data;
    },
  });

  return (
    <div className="m-6 overflow-hidden rounded-lg bg-[#F2F1F6] pt-2">
      <div className="flex justify-between py-2">
        <h2 className="mb-2 px-4 text-4xl font-semibold text-sera-jet">
          Ticket{" "}
          {recentTicket.data && (
            <span className="text-sm font-normal italic">
              This is the last 4 recent tickets
            </span>
          )}
        </h2>
        <Link to="/dashboard/tickets" className="my-auto mr-4">
          <Button className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50">
            View all
          </Button>
        </Link>
      </div>

      <TicketsTable
        tickets={recentTicket.isLoading ? undefined : recentTicket.data.data}
      />
    </div>
  );
};
