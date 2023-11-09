type Props = {
  value: number;
  onChange: (value: number) => void;
};

export default function SingleSliderInput(props: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <span
        style={{
          width: 50,
          flex: "none",
          textAlign: "center",
        }}
      >
        {Math.round(props.value * 10000) / 10000}
      </span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.0001}
        value={props.value}
        onChange={(e) => props.onChange(parseFloat(e.target.value))}
        style={{
          width: 500,
          flex: "1 1 0px",
        }}
      />
    </div>
  );
}
