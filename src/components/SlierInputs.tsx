import SingleSliderInput from "./SingleSliderInput.tsx";
import { BaryColorizer, makeBaryToLinear } from "../colorizer/types.ts";

type Props = {
  onChange: (a: number, b: number, c: number) => void;
  a: number;
  b: number;
  c: number;
  colorizer: BaryColorizer;
};

export function changeBaryValue(
  oldVal: number,
  newVal: number,
  other1: number,
  other2: number,
): [number, number] {
  if (newVal === oldVal) {
    return [other1, other2];
  }
  if (newVal === 1) {
    return [0, 0];
  }
  const diff = newVal - oldVal;
  const div = other1 + other2;
  if (div === 0) {
    return [other1 - diff / 2, other2 - diff / 2];
  }
  const other1Part = other1 / div;
  const other2Part = 1 - other1Part;
  return [other1 - diff * other1Part, other2 - diff * other2Part];
}

export default function SliderInputs(props: Props) {
  const { a, b, c, onChange, colorizer } = props;
  return (
    <>
      <SingleSliderInput
        value={a}
        onChange={(newA) => {
          const [newB, newC] = changeBaryValue(a, newA, b, c);
          onChange(newA, newB, newC);
        }}
        colorizer={makeBaryToLinear(colorizer, (newA) => {
          const [newB, newC] = changeBaryValue(a, newA, b, c);
          return [newA, newB, newC];
        })}
      />
      <SingleSliderInput
        value={b}
        onChange={(newB) => {
          const [newA, newC] = changeBaryValue(b, newB, a, c);
          onChange(newA, newB, newC);
        }}
        colorizer={makeBaryToLinear(colorizer, (newB) => {
          const [newA, newC] = changeBaryValue(b, newB, a, c);
          return [newA, newB, newC];
        })}
      />
      <SingleSliderInput
        value={c}
        onChange={(newC) => {
          const [newA, newB] = changeBaryValue(c, newC, a, b);
          onChange(newA, newB, newC);
        }}
        colorizer={makeBaryToLinear(colorizer, (newC) => {
          const [newA, newB] = changeBaryValue(c, newC, a, b);
          return [newA, newB, newC];
        })}
      />
    </>
  );
}
