"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

interface PaginationCompProps {
  currentPage: number;
  totalPage: number;
  setPage: Dispatch<SetStateAction<string>>;
}

const PaginationComp: React.FC<PaginationCompProps> = ({
  currentPage,
  totalPage,
  setPage,
}) => {
  const displayPageCount = totalPage - currentPage >= 5 ? 4 : totalPage;

  return (
    <Pagination className="mt-5">
      <PaginationContent className="flex items-center gap-8">
        {currentPage && totalPage && (
          <>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && setPage(String(currentPage - 1))
                }
              />
            </PaginationItem>
            {[...Array(displayPageCount)].map((_, index) => {
              const pageNumber = currentPage + index;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => setPage(String(pageNumber))}
                    className={cn(
                      "p-3",
                      pageNumber === currentPage ? "bg-white text-black" : ""
                    )}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            {totalPage - currentPage >= 5 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setPage(String(totalPage))}
                    className="p-3"
                  >
                    {totalPage}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage !== totalPage && setPage(String(currentPage + 1))
                }
              />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComp;
