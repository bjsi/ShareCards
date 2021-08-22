import { elData } from "./TestData";
import ElementContainer from "./SuperMemo/Elements/Element";
import Header from "./Views/Header";
import Footer from "./Views/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="flex items-center justify-center mb-2">
        <div className="grid grid-flow-col gap-2">
          {elData.map(data => (
            <ElementContainer {...data} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
