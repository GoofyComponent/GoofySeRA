import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  setNextPage: (page: number) => void;
};

export const Pagination = ({
  totalPages,
  currentPage,
  setNextPage,
}: PaginationProps) => {
  const totalPagesPlusOne = Array.from(Array(totalPages).keys()).map(function (
    page
  ) {
    return page + 1;
  });

  return (
    <ul className="mx-auto flex h-14 items-center justify-center -space-x-px align-middle text-sm">
      {currentPage != 1 && (
        <li>
          <button
            type="button"
            title="Previous page"
            className={clsx(
              "cursor-pointer",
              "m-2 flex h-10 w-10 items-center justify-center rounded-full leading-tight",
              "bg-transparent text-sera-jet hover:bg-sera-periwinkle hover:text-sera-jet"
            )}
            onClick={() => setNextPage(currentPage - 1)}
          >
            <ChevronLeft />
          </button>
        </li>
      )}
      {totalPagesPlusOne.map((page) => {
        console.log(page);
        return (
          <li key={page}>
            <button
              title={`Go to page ${page}}`}
              type="button"
              className={clsx(
                "cursor-pointer",
                "m-2 flex h-10 w-10 items-center justify-center rounded-full leading-tight",
                currentPage === page
                  ? "bg-sera-jet text-sera-periwinkle hover:bg-sera-periwinkle hover:text-sera-jet"
                  : "bg-transparent text-sera-jet hover:bg-sera-periwinkle hover:text-sera-jet"
              )}
              onClick={() => setNextPage(page)}
            >
              {page}
            </button>
          </li>
        );
      })}

      {currentPage != totalPages && (
        <li>
          <button
            title="Next page"
            type="button"
            className={clsx(
              "cursor-pointer",
              "m-2 flex h-10 w-10 items-center justify-center rounded-full leading-tight",
              "bg-transparent text-sera-jet hover:bg-sera-periwinkle hover:text-sera-jet"
            )}
          >
            <ChevronRight onClick={() => setNextPage(currentPage + 1)} />
          </button>
        </li>
      )}
    </ul>
  );
};
