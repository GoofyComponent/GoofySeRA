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

  if (totalPages <= 1) {
    return null;
  }

  if (totalPages <= 5) {
    return (
      <ul className="mx-auto flex h-14 items-center justify-center -space-x-px align-middle text-sm">
        <li>
          <button
            type="button"
            title="Previous page"
            className={clsx(
              "m-2 flex h-10 w-10 items-center justify-center rounded-full leading-tight",
              "bg-transparent text-sera-jet",
              currentPage != 1
                ? "hover:text-sera- cursor-pointer hover:bg-sera-periwinkle"
                : "opacity-25"
            )}
            onClick={() => {
              if (currentPage == 1) {
                return;
              }
              setNextPage(currentPage - 1);
            }}
          >
            <ChevronLeft />
          </button>
        </li>

        {totalPagesPlusOne.map((page) => {
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

        <li className={clsx(currentPage == totalPages && "cursor-default")}>
          <button
            title="Next page"
            type="button"
            className={clsx(
              "m-2 flex h-10 w-10 items-center justify-center rounded-full leading-tight",
              "bg-transparent text-sera-jet",
              currentPage != totalPages
                ? "cursor-pointer hover:bg-sera-periwinkle hover:text-sera-jet"
                : "opacity-25"
            )}
          >
            <ChevronRight
              onClick={() => {
                if (currentPage == totalPages) {
                  return;
                }
                setNextPage(currentPage + 1);
              }}
            />
          </button>
        </li>
      </ul>
    );
  }

  const pages = [
    (currentPage - 1).toString(),
    currentPage.toString(),
    (currentPage + 1).toString(),
  ];

  if (currentPage == 1) {
    pages.shift();
    pages.push((currentPage + 2).toString());
  }

  if (currentPage == totalPages) {
    pages.pop();
    pages.unshift((currentPage - 2).toString());
  }

  return (
    <ul className="mx-auto flex h-14 items-center justify-center -space-x-px align-middle text-sm">
      <li>
        <button
          type="button"
          title="Previous page"
          className={clsx(
            "m-2 flex h-10 w-10 items-center justify-center rounded-full leading-tight",
            "bg-transparent text-sera-jet",
            currentPage != 1
              ? "hover:text-sera- cursor-pointer hover:bg-sera-periwinkle"
              : "opacity-25"
          )}
          onClick={() => {
            if (currentPage == 1) {
              return;
            }
            setNextPage(currentPage - 1);
          }}
        >
          <ChevronLeft />
        </button>
      </li>

      {pages.map((page) => {
        const pageInINT = parseInt(page);

        return (
          <li key={page}>
            <button
              title={`Go to page ${page}}`}
              type="button"
              className={clsx(
                "cursor-pointer",
                "m-2 flex h-10 w-10 items-center justify-center rounded-full leading-tight",
                currentPage === pageInINT
                  ? "bg-sera-jet text-sera-periwinkle hover:bg-sera-periwinkle hover:text-sera-jet"
                  : "bg-transparent text-sera-jet hover:bg-sera-periwinkle hover:text-sera-jet"
              )}
              onClick={() => setNextPage(pageInINT)}
            >
              {page}
            </button>
          </li>
        );
      })}

      <li className={clsx(currentPage == totalPages && "cursor-default")}>
        <button
          title="Next page"
          type="button"
          className={clsx(
            "m-2 flex h-10 w-10 items-center justify-center rounded-full leading-tight",
            "bg-transparent text-sera-jet",
            currentPage != totalPages
              ? "cursor-pointer hover:bg-sera-periwinkle hover:text-sera-jet"
              : "opacity-25"
          )}
          onClick={() => {
            if (currentPage == totalPages) {
              return;
            }
            setNextPage(currentPage + 1);
          }}
        >
          <ChevronRight />
        </button>
      </li>
    </ul>
  );
};
