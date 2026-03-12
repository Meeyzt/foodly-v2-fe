export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
};
