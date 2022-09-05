import React from "react";
import Pagination from "react-bootstrap/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { adminUsersSetPage } from "../../../store/admin";

function UserSearchPagination(props) {
  const { page, count } = useSelector((state) => ({
    count: state.admin.count,
    page: state.admin.page,
  }));

  const dispatch = useDispatch();
  const handlePageMove = (newPage) => (event) => {
    console.log(newPage);
    dispatch(adminUsersSetPage(newPage));
    props.updateList(event);
  };

  const before = page == 1 ? "disabled" : "";
  const after = page == count ? "disabled" : "";

  return (
    <Pagination className="d-flex justify-content-center">
      <Pagination.First className={before} onClick={handlePageMove(1)} />
      <Pagination.Prev className={before} onClick={handlePageMove(page - 1)} />
      {before == "" ? (
        <Pagination.Item onClick={handlePageMove(page - 1)}>
          {page - 1}
        </Pagination.Item>
      ) : (
        ""
      )}
      <Pagination.Item active>{page}</Pagination.Item>
      {after == "" ? (
        <Pagination.Item onClick={handlePageMove(page + 1)}>
          {page + 1}
        </Pagination.Item>
      ) : (
        ""
      )}

      <Pagination.Next className={after} onClick={handlePageMove(page + 1)} />
      <Pagination.Last className={after} onClick={handlePageMove(count)} />
    </Pagination>
  );
}

export default UserSearchPagination;
