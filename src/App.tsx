import { useState } from "react";
import { CombinedBaryInput } from "./components/CombinedBaryInput.tsx";

function App() {
  const [a, setA] = useState(1 / 3);
  const [b, setB] = useState(1 / 3);
  const [c, setC] = useState(1 / 3);

  const onChange = (a: number, b: number, c: number) => {
    setA(a);
    setB(b);
    setC(c);
  };

  return <CombinedBaryInput a={a} b={b} c={c} onChange={onChange} />;
}

export default App;
