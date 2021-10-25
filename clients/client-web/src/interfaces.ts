export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyListener = (...args: any[]) => any;
export type VoidListener = () => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ErrorListener = (error: any) => void;
