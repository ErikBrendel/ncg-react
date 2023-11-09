import Ncg1dEqualInstance from "../networks/Ncg1dEqual.ts";

type Props = {
  ncg: Ncg1dEqualInstance;
};

export default function NcgDisplay(props: Props) {
  const { ncg } = props;
  const COMPONENT_HEIGHT = 500;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${ncg.nodes.length}, minmax(0, 1fr))`,
        width: 500,
        height: COMPONENT_HEIGHT,
        backgroundColor: "#ccc",
      }}
    >
      {ncg.nodes.map((node, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              backgroundColor: "black",
            }}
          />
          <div
            style={{
              width: 1,
              height: (node.sendDistance / ncg.nodes.length) * COMPONENT_HEIGHT,
              backgroundColor: "black",
            }}
          />
        </div>
      ))}
    </div>
  );
}
