import { useEffect, useState } from "react";
import { CombinedBaryInput } from "./components/CombinedBaryInput.tsx";
import NcgDisplay from "./components/NcgDisplay.tsx";
import Ncg1dEqualInstance, { sum } from "./networks/Ncg1dEqual.ts";
import NcgCostFunction from "./networks/NcgCostFunction.tsx";
import {
  makeScalarColorizer,
  slowlyCalculatingColorizer,
} from "./colorizer/types.ts";

let colorizer = makeScalarColorizer(7, 49, (a, b, c) => {
  const cf = new NcgCostFunction(a, b, c);
  const inst = new Ncg1dEqualInstance(7);
  inst.optimizeSimple(cf);
  return sum(inst.nodes.map((n) => n.sendDistance));
});
colorizer = slowlyCalculatingColorizer(colorizer, 50);

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
    const i = setInterval(() => setRefresh((r) => r + 1), 50);
    return () => clearInterval(i);
  }, []);

  const ncg = new Ncg1dEqualInstance(7);
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
