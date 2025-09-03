import React, { useState, useEffect, useRef } from "react";

function Pagination({
  data,
  RenderComponent,
  pageLimit,
  dataLimit,
  setDataLimit,
  actionHandler,
  row,
  tableView,
  metadata,
  userEmail,
  setUserEmail,
  mobileNumber,
  refreshData,
  setCategoryDropdownOpen,
}) {
  const contentRef = useRef(null);
  const pageStr = Math.ceil(data.length / dataLimit);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNeighbours] = useState(1);
  const [next, setNext] = useState(pageLimit);
  const [pageRef, setPageRef] = useState(1);

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
    if (setCategoryDropdownOpen) setCategoryDropdownOpen(false);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => page - 1);
    if (setCategoryDropdownOpen) setCategoryDropdownOpen(false);
  }

  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    if (startIndex > data.length) {
      return data;
    } else {
      return data.slice(startIndex, endIndex);
    }
  };

  const gotoPage = (page) => {
    // const { onPageChanged = f => f } = this.props;
    if (setCategoryDropdownOpen) setCategoryDropdownOpen(false);

    const currPage = Math.max(0, Math.min(page, pageStr));

    // const paginationData = {
    //   currentPage,
    //   totalPages: this.totalPages,
    //   pageLimit: this.pageLimit,
    //   totalRecords: this.totalRecords
    // };
    setCurrentPage(currPage);

    // this.setState({ currentPage }, () => onPageChanged(paginationData));
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
    const totalPages = pageStr;
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

  function loadMore() {
    setDataLimit(pageLimit + next);
    setNext(next + pageLimit);
    setPageRef(pageRef + 1);
    // setCurrentPage((page) => page + 1);
  }

  function loadLess() {
    setDataLimit(pageLimit);
    // setCurrentPage(1);
    setPageRef(1);
    if (!tableView) contentRef.current.scrollIntoView();
  }

  return (
    <>
      {tableView ? (
        <>
          {getPaginatedData().map((d, idx) => (
            <RenderComponent
              key={idx}
              data={d}
              actionHandler={actionHandler}
              metadata={metadata}
              userEmail={userEmail}
              setUserEmail={setUserEmail}
              mobileNumber={mobileNumber}
              refreshData={refreshData}
              setCategoryDropdownOpen={setCategoryDropdownOpen}
            />
          ))}
        </>
      ) : (
        <div className={row ? "row" : ""} ref={contentRef}>
          {getPaginatedData().map((d, idx) => (
            <RenderComponent
              key={idx}
              data={d}
              actionHandler={actionHandler}
              metadata={metadata}
              userEmail={userEmail}
              setUserEmail={setUserEmail}
              mobileNumber={mobileNumber}
              refreshData={refreshData}
            />
          ))}
        </div>
      )}
      {data.length > dataLimit ? (
        <>
          <div
            style={
              tableView
                ? {
                    position: "absolute",
                    left: "0px",
                    right: "0px",
                  }
                : {}
            }
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
                            <a
                              className="page-link"
                              // href="#"
                              // aria-label="Previous"
                              onClick={handleMoveLeft}
                            >
                              {/* <span aria-hidden="true">&laquo;</span> */}
                              <span aria-hidden="true">...</span>
                              <span className="sr-only">Previous</span>
                            </a>
                          </li>
                        );

                      if (page === RIGHT_PAGE)
                        return (
                          <li key={index} className="page-item">
                            <a
                              className="page-link"
                              // href="#"
                              // aria-label="Next"
                              onClick={handleMoveRight}
                            >
                              {/* <span aria-hidden="true">&raquo;</span> */}
                              <span aria-hidden="true">...</span>
                              <span className="sr-only">Next</span>
                            </a>
                          </li>
                        );

                      return (
                        <li
                          key={index}
                          // className={`page-item${
                          //   currentPage === page ? " active" : ""
                          // }`}
                          className={`paginationjs-page J-paginationjs-page ${
                            currentPage === page ? "active" : ""
                          }`}
                        >
                          <a
                            // className="page-link"
                            // href="#"
                            onClick={(e) => handleClick(page, e)}
                            // onClick={changePage}
                          >
                            {page}
                          </a>
                        </li>
                      );
                    })}
                    <li
                      //   className="paginationjs-next J-paginationjs-next"
                      className={`paginationjs-next J-paginationjs-next" ${
                        currentPage === pageStr ? "disabled" : ""
                      }`}
                      data-num="2"
                      title="Next page"
                      onClick={currentPage !== pageStr ? goToNextPage : null}
                    >
                      <a>»</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {data.length > pageLimit ? (
        <>
          {pageRef !== Math.ceil(data.length / pageLimit) ? (
            <div
              className="mobile--only load-more"
              style={
                tableView
                  ? {
                      position: "absolute",
                      left: "0px",
                      right: "0px",
                    }
                  : {}
              }
              onClick={loadMore}
            >
              <p>Load More</p>
              <span className="loadmoreless_chevron down_arrow"></span>
            </div>
          ) : null}
          {pageRef === Math.ceil(data.length / pageLimit) ? (
            <div
              className="mobile--only"
              style={
                tableView
                  ? {
                      position: "absolute",
                      left: "0px",
                      right: "0px",
                    }
                  : {}
              }
              onClick={loadLess}
            >
              <p>Load Less</p>
              <span className="loadmoreless_chevron up_arrow"></span>
            </div>
          ) : null}
        </>
      ) : null}
    </>
  );
}

export default Pagination;
