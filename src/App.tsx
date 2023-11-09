import { useEffect, useState } from "react";
import { CombinedBaryInput } from "./components/CombinedBaryInput.tsx";
import NcgDisplay from "./components/NcgDisplay.tsx";
import Ncg1dEqualInstance from "./networks/Ncg1dEqual.ts";
import NcgCostFunction from "./networks/NcgCostFunction.tsx";
import {
  makeDistinctRandomColorizer,
  slowlyCalculatingColorizer,
} from "./colorizer/types.ts";

const N = 7;
let colorizer = makeDistinctRandomColorizer((a, b, c) => {
  const cf = new NcgCostFunction(a, b, c);
  const inst = new Ncg1dEqualInstance(N);
  inst.optimizeSimple(cf);
  return inst.nodes.map((n) => n.sendDistance).join(",");
});

const DELAY = 100;
colorizer = slowlyCalculatingColorizer(colorizer, DELAY);

function App() {
  const [a, setA] = useState(1 / 3);
  const [b, setB] = useState(1 / 3);
  const [c, setC] = useState(1 / 3);

  const onChange = (a: number, b: number, c: number) => {
    setA(a);
    setB(b);
    setC(c);
  };

  const [_, setRefresh] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setRefresh((r) => r + 1), DELAY);
    return () => clearInterval(i);
  }, []);

  const ncg = new Ncg1dEqualInstance(N);
  ncg.optimizeSimple(new NcgCostFunction(a, b, c));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <NcgDisplay ncg={ncg} />
      <CombinedBaryInput
        a={a}
        b={b}
        c={c}
        onChange={onChange}
        colorizer={colorizer}
      />
    </div>
  );
}

export default App;
