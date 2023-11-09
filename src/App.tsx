import { useState } from "react";
import { CombinedBaryInput } from "./components/CombinedBaryInput.tsx";
import NcgDisplay from "./components/NcgDisplay.tsx";
import Ncg1dEqualInstance from "./networks/Ncg1dEqual.ts";
import NcgCostFunction from "./networks/NcgCostFunction.tsx";

function App() {
  const [a, setA] = useState(1 / 3);
  const [b, setB] = useState(1 / 3);
  const [c, setC] = useState(1 / 3);

  const onChange = (a: number, b: number, c: number) => {
    setA(a);
    setB(b);
    setC(c);
  };

  const ncg = new Ncg1dEqualInstance(7);
  ncg.optimizeSimple(new NcgCostFunction(a, b, c));

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <NcgDisplay ncg={ncg} />
      <CombinedBaryInput a={a} b={b} c={c} onChange={onChange} />
    </div>
  );
}

export default App;
