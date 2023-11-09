import React, { useRef, useState } from "react";

type Props = {
  onChange: (a: number, b: number, c: number) => void;
  a: number;
  b: number;
  c: number;
};

export default function BarycentricInput(props: Props) {
  const { a, b, c, onChange } = props;
  console.debug({ a, b, c });

  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const TRIANGLE_SIZE = 500;
  const TRIANGLE_HEIGHT = TRIANGLE_SIZE * 0.866;
  const PADDING = 50;

  // calculate current value in xy coords based on the (already normalized) barycentric coords
  const finalX = (b + c / 2) * TRIANGLE_SIZE;
  const finalY = (1 - c) * TRIANGLE_HEIGHT;

  function updateFromXY(x: number, y: number) {
    const A = {
      X: 0,
      Y: TRIANGLE_HEIGHT,
    };
    const B = {
      X: TRIANGLE_SIZE,
      Y: TRIANGLE_HEIGHT,
    };
    const C = {
      X: TRIANGLE_SIZE / 2,
      Y: 0,
    };
    const P = {
      X: x,
      Y: y,
    };
    /*if (P.Y > TRIANGLE_HEIGHT) {
      P.Y = TRIANGLE_HEIGHT;
    }
    if (P.Y < 0) {
      P.Y = 0;
    }
    if (P.X > TRIANGLE_SIZE) {
      P.X = TRIANGLE_SIZE;
    }
    if (P.X < 0) {
      P.X = 0;
    }*/

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

    console.log({ x, y, A, B, C, D, w_A, w_B, w_C });
    onChange(w_A, w_B, w_C);
  }

  const onMouseEvent = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - PADDING;
    const y = e.clientY - rect.top - PADDING;
    console.log(x, y);
    updateFromXY(x, y);
  };

  return (
    <div
      ref={ref}
      style={{
        width: TRIANGLE_SIZE,
        height: TRIANGLE_HEIGHT,
        padding: PADDING,
        position: "relative",
        backgroundColor: "#ccc",
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
      <div
        style={{
          position: "absolute",
          left: finalX + PADDING,
          top: finalY + PADDING,
          width: 20,
          height: 20,
          backgroundColor: isDragging ? "red" : "green",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
