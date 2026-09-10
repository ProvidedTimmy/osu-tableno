import { render } from "preact";
import CalculatorPage from "../components/CalculatorPage.tsx";
import "../static/styles.css";

render(<CalculatorPage />, document.getElementById("app")!);
