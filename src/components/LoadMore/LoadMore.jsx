import { PaginationaBtn } from './LoadMore.styled';

export const Pagination = ({ onClick, children }) => {
  return (
    <>
      <PaginationaBtn onClick={onClick}>{children}</PaginationaBtn>
    </>
  );
};
