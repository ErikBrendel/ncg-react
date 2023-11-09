import BarycentricInput from "./BarycentricInput.tsx";
import SliderInputs from "./SlierInputs.tsx";

export function CombinedBaryInput(props: {
  a: number;
  b: number;
  c: number;
  onChange: (a: number, b: number, c: number) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      <BarycentricInput
        a={props.a}
        b={props.b}
        c={props.c}
        onChange={props.onChange}
      />
      <SliderInputs
        a={props.a}
        b={props.b}
        c={props.c}
        onChange={props.onChange}
      />
    </div>
  );
}
