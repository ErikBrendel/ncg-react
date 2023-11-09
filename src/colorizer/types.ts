export type BaryColorizer = {
  getColorAt: (a: number, b: number, c: number) => string;
  changeCounter?: number;
};

export const RGBColorizer: BaryColorizer = {
  getColorAt: (a: number, b: number, c: number) => {
    const r = Math.floor(a * 255);
    const g = Math.floor(b * 255);
    const b_ = Math.floor(c * 255);
    return `rgb(${r}, ${g}, ${b_})`;
  },
};

export function makeScalarColorizer(
  min: number,
  max: number,
  func: (a: number, b: number, c: number) => number,
): BaryColorizer {
  return {
    getColorAt: (a: number, b: number, c: number) => {
      const value = func(a, b, c);
      const norm = (value - min) / (max - min);
      return `rgb(${(1 - norm) * 255}, ${norm * 255}, 0)`;
    },
  };
}

export function cachedColorizer(colorizer: BaryColorizer): BaryColorizer {
  const cache: { [key: string]: string } = {};
  return {
    getColorAt: (a: number, b: number, c: number) => {
      const key = `${a},${b},${c}`;
      if (cache[key] !== undefined) {
        return cache[key];
      }
      const color = colorizer.getColorAt(a, b, c);
      cache[key] = color;
      return color;
    },
  };
}

export function slowlyCalculatingColorizer(
  colorizer: BaryColorizer,
  delay = 100,
): BaryColorizer {
  const cache: { [key: string]: string } = {};
  let lastCalculationTime = 0;
  let changeCounter = 0;
  return {
    getColorAt: (a: number, b: number, c: number) => {
      const key = `${a},${b},${c}`;
      if (cache[key] !== undefined) {
        return cache[key];
      }
      const now = Date.now();
      if (now - lastCalculationTime < delay) {
        setTimeout(() => {
          changeCounter++;
        }, delay);
        return "#000000";
      }
      lastCalculationTime = now;
      const color = colorizer.getColorAt(a, b, c);
      cache[key] = color;
      return color;
    },
    changeCounter,
  };
}
