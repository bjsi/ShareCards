import { elData } from "./TestData";
import ElementContainer from "./Elements/Element";

function App() {
  return <div className="App">{elData.map(d => ElementContainer(d))}</div>;
}

export default App;
