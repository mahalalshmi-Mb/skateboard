import React, { useState } from "react";

function ServerSidePagination({
  data,
  RenderComponent,
  maxPage,
  pageCount,
  dataLimit,
  handleGoToPage,
  handleNextPage,
  handlePreviousPage,
  handleGoToPageOne,
  actionHandler,
  isDesktop,
}) {
  const [pages] = useState(maxPage);
  const [currentPage, setCurrentPage] = useState(pageCount);
  const [pageNeighbours] = useState(1);

  const LEFT_PAGE = "LEFT";
  const RIGHT_PAGE = "RIGHT";

  const range = (from, to, step = 1) => {
    let i = from;
    const range = [];

    while (i <= to) {
      range.push(i);
      i += step;
    }

    return range;
  };

  function goToNextPage() {
    setCurrentPage((page) => page + 1);
    handleNextPage();
  }

  function goToPreviousPage() {
    setCurrentPage((page) => page - 1);
    handlePreviousPage();
  }

  function goToPageOne() {
    setCurrentPage(1);
    handleGoToPageOne();
  }

  const getPaginatedData = () => {
    return data;
  };

  const gotoPage = (page) => {
    const currPage = Math.max(0, Math.min(page, maxPage));
    setCurrentPage(currPage);
    handleGoToPage(currPage);
  };

  const handleClick = (page, evt) => {
    evt.preventDefault();
    gotoPage(page);
  };

  const handleMoveLeft = (evt) => {
    evt.preventDefault();
    gotoPage(currentPage - pageNeighbours * 2 - 1);
  };

  const handleMoveRight = (evt) => {
    evt.preventDefault();
    gotoPage(currentPage + pageNeighbours * 2 + 1);
  };

  const fetchPageNumbers = () => {
    const totalPages = maxPage;
    const currPage = currentPage;
    const PAGENEIGHBOURS = pageNeighbours;

    const totalNumbers = PAGENEIGHBOURS * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      let pages = [];

      const leftBound = currPage - PAGENEIGHBOURS;
      const rightBound = currPage + PAGENEIGHBOURS;
      const beforeLastPage = totalPages - 1;

      const startPage = leftBound > 2 ? leftBound : 2;
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

      pages = range(startPage, endPage);

      const pagesCount = pages.length;
      const singleSpillOffset = totalNumbers - pagesCount - 1;

      const leftSpill = startPage > 2;
      const rightSpill = endPage < beforeLastPage;

      const leftSpillPage = LEFT_PAGE;
      const rightSpillPage = RIGHT_PAGE;

      if (leftSpill && !rightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [leftSpillPage, ...extraPages, ...pages];
      } else if (!leftSpill && rightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, rightSpillPage];
      } else if (leftSpill && rightSpill) {
        pages = [leftSpillPage, ...pages, rightSpillPage];
      }
      return [1, ...pages, totalPages];
    }
    return range(1, totalPages);
  };

  return (
    <>
      <>
        {getPaginatedData().map((d, idx) => (
          <RenderComponent key={idx} data={d} actionHandler={actionHandler} />
        ))}
      </>
      <>
        <div
          style={{
            position: "absolute",
            left: "0px",
            right: "0px",
          }}
        >
          <div className="pagination--links desktop-only">
            <div className="paginationjs">
              <div className="paginationjs-pages">
                <ul>
                  <li
                    className={`paginationjs-prev ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                    onClick={currentPage !== 1 ? goToPreviousPage : null}
                  >
                    <a>«</a>
                  </li>
                  {fetchPageNumbers().map((page, index) => {
                    if (page === LEFT_PAGE)
                      return (
                        <li key={index} className="page-item">
                          <a className="page-link" onClick={handleMoveLeft}>
                            <span aria-hidden="true">...</span>
                            <span className="sr-only">Previous</span>
                          </a>
                        </li>
                      );

                    if (page === RIGHT_PAGE)
                      return (
                        <li key={index} className="page-item">
                          <a className="page-link" onClick={handleMoveRight}>
                            <span aria-hidden="true">...</span>
                            <span className="sr-only">Next</span>
                          </a>
                        </li>
                      );

                    return (
                      <li
                        key={index}
                        className={`paginationjs-page J-paginationjs-page ${
                          currentPage === page ? "active" : ""
                        }`}
                      >
                        <a onClick={(e) => handleClick(page, e)}>{page}</a>
                      </li>
                    );
                  })}
                  <li
                    className={`paginationjs-next J-paginationjs-next" ${
                      currentPage === pages ? "disabled" : ""
                    }`}
                    data-num="2"
                    title="Next page"
                    onClick={currentPage !== pages ? goToNextPage : null}
                  >
                    <a>»</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
      <>
        {maxPage > 1 ? (
          <>
            {currentPage !== maxPage ? (
              <div
                className="mobile--only load-more"
                onClick={goToNextPage}
                style={{
                  position: "absolute",
                  left: "0px",
                  right: "0px",
                }}
              >
                <p>Load More</p>
                <span className="loadmoreless_chevron down_arrow"></span>
              </div>
            ) : null}
            {currentPage === maxPage ? (
              <div
                className="mobile--only"
                onClick={goToPageOne}
                style={{
                  position: "absolute",
                  left: "0px",
                  right: "0px",
                }}
              >
                <p>Load Less</p>
                <span className="loadmoreless_chevron up_arrow"></span>
              </div>
            ) : null}
          </>
        ) : null}
      </>
    </>
  );
}

export default ServerSidePagination;
