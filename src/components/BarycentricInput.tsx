import React, { useMemo, useRef, useState } from "react";
import { BaryColorizer } from "../colorizer/types.ts";

type Props = {
  onChange: (a: number, b: number, c: number) => void;
  a: number;
  b: number;
  c: number;
  colorizer: BaryColorizer;
};

const TRIANGLE_SIZE = 500;
const TRIANGLE_HEIGHT = TRIANGLE_SIZE * 0.866;
const PADDING = 50;

const COLOR_RESOLUTION = 32;
const COLOR_STEP = 1 / COLOR_RESOLUTION;
const COLOR_POINT_SIZE = (TRIANGLE_SIZE / COLOR_RESOLUTION) * 1.3;

export default function BarycentricInput(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { a, b, c, onChange, colorizer } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // calculate current value in xy coords based on the (already normalized) barycentric coords
  const finalX = (b + c / 2) * TRIANGLE_SIZE;
  const finalY = (1 - c) * TRIANGLE_HEIGHT;

  function updateFromXY(x: number, y: number) {
    const A = { X: 0, Y: TRIANGLE_HEIGHT };
    const B = { X: TRIANGLE_SIZE, Y: TRIANGLE_HEIGHT };
    const C = { X: TRIANGLE_SIZE / 2, Y: 0 };
    const P = { X: x, Y: y };

    const D = (B.Y - C.Y) * (A.X - C.X) + (C.X - B.X) * (A.Y - C.Y);
    let w_A = ((B.Y - C.Y) * (P.X - C.X) + (C.X - B.X) * (P.Y - C.Y)) / D;
    let w_B = ((C.Y - A.Y) * (P.X - C.X) + (A.X - C.X) * (P.Y - C.Y)) / D;
    let w_C = 1 - w_A - w_B;

    if ((w_A < 0 && w_B < -w_A / 2) || (w_B < 0 && w_A < -w_B / 2)) {
      w_A = 0;
      w_B = 0;
      w_C = 1;
    }
    if ((w_A < 0 && w_C < -w_A / 2) || (w_C < 0 && w_A < -w_C / 2)) {
      w_A = 0;
      w_B = 1;
      w_C = 0;
    }
    if ((w_B < 0 && w_C < -w_B / 2) || (w_C < 0 && w_B < -w_C / 2)) {
      w_A = 1;
      w_B = 0;
      w_C = 0;
    }

    if (w_A < 0) {
      w_B += w_A / 2;
      w_C += w_A / 2;
      w_A = 0;
    }
    if (w_B < 0) {
      w_A += w_B / 2;
      w_C += w_B / 2;
      w_B = 0;
    }
    if (w_C < 0) {
      w_A += w_C / 2;
      w_B += w_C / 2;
      w_C = 0;
    }

    onChange(w_A, w_B, w_C);
  }

  const onMouseEvent = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - PADDING;
    const y = e.clientY - rect.top - PADDING;
    updateFromXY(x, y);
  };

  const colorDivs = useMemo(() => {
    const colorCoordinates = [];
    for (let i = 0; i <= 1; i += COLOR_STEP) {
      for (let j = 0; j <= 1 - i; j += COLOR_STEP) {
        const k = 1 - i - j;
        colorCoordinates.push([i, j, k]);
      }
    }
    return colorCoordinates.map(([i, j, k]) => {
      const color = colorizer.getColorAt(i, j, k);
      const cX = (j + k / 2) * TRIANGLE_SIZE;
      const cY = (1 - k) * TRIANGLE_HEIGHT;
      return (
        <div
          key={`${i}${j}${k}`}
          style={{
            width: COLOR_POINT_SIZE,
            height: COLOR_POINT_SIZE,
            backgroundColor: color,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            position: "absolute",
            left: cX + PADDING,
            top: cY + PADDING,
          }}
        />
      );
    });
  }, [colorizer, Math.random()]);

  return (
    <div
      ref={ref}
      style={{
        width: TRIANGLE_SIZE,
        height: TRIANGLE_HEIGHT,
        padding: PADDING,
        position: "relative",
        backgroundColor: "#ccc",
        borderRadius: 10,
      }}
      onMouseDown={(e) => {
        setIsDragging(true);
        onMouseEvent(e);
      }}
      onMouseMove={(e) => {
        if (e.buttons === 1) {
          onMouseEvent(e);
        }
      }}
      onMouseUp={(e) => {
        setIsDragging(false);
        onMouseEvent(e);
      }}
    >
      <div
        style={{
          borderBottom: `${TRIANGLE_HEIGHT}px solid #999`,
          borderLeft: `${TRIANGLE_SIZE / 2}px solid transparent`,
          borderRight: `${TRIANGLE_SIZE / 2}px solid transparent`,
          borderTop: 0,
          height: 0,
          width: 0,
          pointerEvents: "none",
        }}
      />
      <>{colorDivs}</>
      <div
        style={{
          position: "absolute",
          left: finalX + PADDING,
          top: finalY + PADDING,
          width: 10,
          height: 10,
          backgroundColor: isDragging ? "#aaa" : "white",
          border: "2px solid black",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
