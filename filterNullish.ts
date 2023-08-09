function isNullish(value: any): boolean {
  return value === null || value === undefined || value === "" || value === 0;
}

type NonNullishValues<T> = {
  [K in keyof T]: T[K] extends (infer U)[]
    ? NonNullishValues<U>[]
    : NonNullishValues<T[K]>;
};

export function filterNullish<T>(obj: T): NonNullishValues<T> {
  if (Array.isArray(obj)) {
    return obj
      .map((val) => filterNullish(val))
      .filter((val) => !isNullish(val)) as unknown as NonNullishValues<T>;
  } else if (typeof obj === "object" && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key as keyof typeof obj];
        if (!isNullish(value)) {
          newObj[key] = filterNullish(value);
        }
      }
    }
    return newObj as NonNullishValues<T>;
  } else {
    return obj as NonNullishValues<T>;
  }
}
