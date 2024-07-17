import { BrowserRouter } from "react-router-dom";

import { Login } from "@/pages/Login";
import { useAuth } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";

function App() {
  const { user, loading }: any = useAuth();

  console.log(user);

  // if (!user && loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <BrowserRouter>
      <>{user ? <Dashboard /> : <Login />}</>
    </BrowserRouter>
  );
}

export default App;
