import { BrowserRouter, Route, Routes } from "react-router-dom";
import SeatBooking from "./Components/SeatBooking";

function App() {
  return (
    <div>
      {/* {loading && <Spinner />} */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SeatBooking />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
