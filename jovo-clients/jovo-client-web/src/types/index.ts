export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type VoidListener = () => void;
export type ErrorListener = (error: Error) => void;
