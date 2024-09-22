import { RootState } from "@/app/store";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { setCurrentPage } from "@/features/foodMenu/foodMenuSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface PaginationSectionProps {
  totalItems: number;
  itemsPerPage: number;
  pageRange: number;
}

function getPagination(
  currentPage: number,
  totalPages: number,
  pageRange: number
) {
  let pages = [];

  let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
  let endPage = Math.min(totalPages, currentPage + Math.floor(pageRange / 2));

  // Ensure the range is always exactly `pageRange` long if possible
  if (endPage - startPage + 1 < pageRange) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + pageRange - 1);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - pageRange + 1);
    }
  }

  // Add pages to the array
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
}

export default function PaginatioinSection(props: PaginationSectionProps) {
  const totalPages = Math.ceil(props.totalItems / props.itemsPerPage);
  const [pages, setPages] = useState<number[]>([]);

  const currentPage = useSelector(
    (state: RootState) => state.foodMenu.currentPage
  );
  const activeCategory = useSelector(
    (state: RootState) => state.foodMenu.activeCategory
  );
  const options = useSelector((state: RootState) => state.foodMenu.options);
  const filteredMenuItems = useSelector(
    (state: RootState) => state.foodMenu.filteredMenuItems
  );
  const dispatch = useDispatch();

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  useEffect(() => {
    if (totalPages === 0) {
      setPages([]);
    } else {
      if (totalPages <= props.pageRange) {
        let pagesRange = [];
        for (let i = 1; i <= totalPages; i++) pagesRange.push(i);
        setPages(pagesRange);
      } else {
        const pagesRange = getPagination(
          currentPage,
          totalPages - 1,
          props.pageRange
        );
        setPages(pagesRange);
      }
    }
  }, [currentPage, filteredMenuItems]);

  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [activeCategory, options]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={`cursor-pointer ${
              totalPages === 0 ? "hidden" : ""
            }`}
            onClick={handlePrevPage}
          />
        </PaginationItem>
        {pages.map((page, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              isActive={currentPage === page}
              onClick={() => dispatch(setCurrentPage(page))}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {totalPages > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {totalPages > 3 && (
          <PaginationItem>
            <PaginationLink
              isActive={currentPage === totalPages}
              onClick={() => dispatch(setCurrentPage(totalPages))}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            className={`cursor-pointer ${
              totalPages === 0 ? "hidden" : ""
            }`}
            onClick={handleNextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
