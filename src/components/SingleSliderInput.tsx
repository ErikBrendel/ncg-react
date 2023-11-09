import { LinearColorizer } from "../colorizer/types.ts";
import React, { useMemo } from "react";

type Props = {
  value: number;
  onChange: (value: number) => void;
  colorizer: LinearColorizer;
};

const SLIDER_WIDTH = 500;

const COLOR_RESOLUTION = 16;
const COLOR_STEP = 1 / COLOR_RESOLUTION;
const COLOR_POINT_SIZE = (SLIDER_WIDTH / COLOR_RESOLUTION) * 0.2;

export default function SingleSliderInput(props: Props) {
  const { value, onChange, colorizer } = props;

  const colorDivs = useMemo(() => {
    const colorCoordinates = [];
    for (let v = 0; v <= 1; v += COLOR_STEP) {
      colorCoordinates.push(v);
    }
    return colorCoordinates.map((v) => {
      const color = colorizer.getColorAt(v);
      const cX = v * SLIDER_WIDTH;
      return (
        <div
          key={`${v}`}
          style={{
            width: COLOR_POINT_SIZE,
            height: COLOR_POINT_SIZE,
            backgroundColor: color,
            borderRadius: "50%",
            transform: "translate(-50%)",
            pointerEvents: "none",
            position: "absolute",
            left: cX + 50,
          }}
        />
      );
    });
  }, [colorizer, Math.random()]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
      }}
    >
      <span
        style={{
          width: 50,
          flex: "none",
          textAlign: "center",
        }}
      >
        {Math.round(value * 10000) / 10000}
      </span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.0001}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: SLIDER_WIDTH,
          flex: "1 1 0px",
        }}
      />
      <>{colorDivs}</>
    </div>
  );
}
