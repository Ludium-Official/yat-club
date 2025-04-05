"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { isEmpty } from "ramda";
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

  const rendering = () => {
    const result = [];
    const maxVisiblePages = 5;

    const startPage = Math.max(
      1,
      Math.min(
        page - Math.floor(maxVisiblePages / 2),
        totalPage - maxVisiblePages + 1
      )
    );

    const endPage = Math.min(totalPage, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      result.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setPage(i)}
            className={cn(
              "p-3",
              i === page ? "text-black" : "text-default-tertiary"
            )}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (isEmpty(result)) {
      result.push(
        <div className="text-black font-normal" key={Math.random()}>
          1
        </div>
      );
    }

    return result;
  };

  return (
    <Pagination className="mt-5">
      <PaginationContent className="flex items-center gap-8">
        {page && (
          <>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
              />
            </PaginationItem>
            {rendering()}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  totalPage > 0 && page !== totalPage && setPage(page + 1)
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
