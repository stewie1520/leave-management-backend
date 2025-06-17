export type PaginateInput = {
  take: number;
  skip: number;
};

export type PaginateOutput<T> = {
  totalPage: number;
  currentPage: number;
  take: number;
  skip: number;
  items: T[];
};
