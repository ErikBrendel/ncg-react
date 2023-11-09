export type BaryColorizer = {
  getColorAt: (a: number, b: number, c: number) => string;
  changeCounter?: number;
};

export type LinearColorizer = {
  getColorAt: (value: number) => string;
  changeCounter?: number;
};

export function makeBaryToLinear(
  colorizer: BaryColorizer,
  mapper: (value: number) => [number, number, number],
): LinearColorizer {
  return {
    getColorAt: (value: number) => {
      return colorizer.getColorAt(...mapper(value));
    },
    changeCounter: colorizer.changeCounter,
  };
}

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
  const cache = new BaryMap<string>();
  return {
    getColorAt: (a: number, b: number, c: number) => {
      if (cache.has(a, b, c)) {
        return cache.get(a, b, c)!;
      }
      const color = colorizer.getColorAt(a, b, c);
      cache.set(a, b, c, color);
      return color;
    },
  };
}

export function slowlyCalculatingColorizer(
  colorizer: BaryColorizer,
  delay = 100,
): BaryColorizer {
  const cache = new BaryMap<string>();
  let lastCalculationTime = 0;
  let changeCounter = 0;
  return {
    getColorAt: (a: number, b: number, c: number) => {
      if (cache.has(a, b, c)) {
        return cache.get(a, b, c)!;
      }
      const now = Date.now();
      if (now - lastCalculationTime < delay) {
        setTimeout(() => {
          changeCounter++;
        }, delay);
        return "transparent";
      }
      lastCalculationTime = now;
      const color = colorizer.getColorAt(a, b, c);
      cache.set(a, b, c, color);
      return color;
    },
    changeCounter,
  };
}

type BaryDataPoint<T> = { a: number; b: number; c: number; value: T };

class BaryMap<T> {
  private dataPoints: BaryDataPoint<T>[] = [];

  constructor(public readonly precision = 0.0002) {}

  public set(a: number, b: number, c: number, value: T) {
    this.dataPoints.push({ a, b, c, value });
  }

  public get(a: number, b: number, c: number): T | undefined {
    const [closest, closestDistance] = this.getClosestDataPoint(a, b, c);
    if (closestDistance > this.precision) {
      return undefined;
    }
    return closest?.value;
  }

  public has(a: number, b: number, c: number): boolean {
    return this.get(a, b, c) !== undefined;
  }

  private getClosestDataPoint(
    a: number,
    b: number,
    c: number,
  ): [BaryDataPoint<T> | undefined, number] {
    if (this.dataPoints.length === 0) {
      return [undefined, Infinity];
    }
    let closest = this.dataPoints[0];
    const testPoint = { a, b, c };
    let closestDistance = this.distanceSq(closest, testPoint);
    for (const dataPoint of this.dataPoints) {
      const distance = this.distanceSq(dataPoint, testPoint);
      if (distance < closestDistance) {
        closest = dataPoint;
        closestDistance = distance;
      }
    }
    return [closest, closestDistance];
  }

  private distanceSq(
    p1: { a: number; b: number; c: number },
    p2: { a: number; b: number; c: number },
  ) {
    const diffA = p1.a - p2.a;
    const diffB = p1.b - p2.b;
    const diffC = p1.c - p2.c;
    return diffA * diffA + diffB * diffB + diffC * diffC;
  }
}
