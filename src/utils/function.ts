export const reverseMap = <T>(
  arr: T[],
  fun: (element: T, index: number, array: T[]) => T
): T[] => {
  if (!arr) return [];
  let newArr = new Array<T>(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    newArr[arr.length - i - 1] = fun(arr[i], i, arr);
  }
  return newArr;
};

export function debounce<T extends Function>(cb: T, wait = 20) {
  let timer: NodeJS.Timeout;
  let callable = (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => cb(...args), wait);
  };

  return callable as any as T;
}
