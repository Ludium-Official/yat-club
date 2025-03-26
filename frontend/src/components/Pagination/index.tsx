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
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface PaginationCompProps {
  totalCount: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

const PaginationComp: React.FC<PaginationCompProps> = ({
  totalCount,
  page,
  setPage,
}) => {
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    const pageCount = Math.ceil(totalCount / 5);
    setTotalPage(pageCount);
  }, [totalCount]);

  const displayPageCount = totalPage - page >= 5 ? 4 : totalPage;

  const rendering = () => {
    const result = [];
    for (let i = 1; i <= displayPageCount; i++) {
      result.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setPage(i)}
            className={cn("p-3", i === page ? "bg-white text-black" : "")}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return result;
  };

  return (
    <Pagination className="mt-5">
      <PaginationContent className="flex items-center gap-8">
        {page && totalPage && (
          <>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
              />
            </PaginationItem>
            {rendering()}
            {totalPage - page >= 5 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setPage(totalPage)}
                    className="p-3"
                  >
                    {totalPage}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => page !== totalPage && setPage(page + 1)}
              />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComp;
