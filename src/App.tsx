import { BrowserRouter } from "react-router-dom";

import { Login } from "@/pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  // if (!user && loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <BrowserRouter>
      {/* <>{user ? <Dashboard /> : <Login />}</> */}
      <Login />
    </BrowserRouter>
  );
}

export default App;
