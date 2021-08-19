import { data } from "./TestData";
import Element from "./Elements/Element";

function App() {
  return <div className="App">{data.map(d => Element(d))}</div>;
}

export default App;
