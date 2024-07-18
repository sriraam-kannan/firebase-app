import { Navigate, Outlet } from "react-router-dom";

import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";


export default function AuthorizedLayout() {
  const user: any = localStorage.getItem("neouser");
  const parsedUser = JSON.parse(user);
  // const currentUser = localStorage.getItem(
  //   "CognitoIdentityServiceProvider.636uic9qj0appc4sc67ot6vcpa.01b37d0a-a0b1-7056-66d3-4bd778564888.signInDetails"
  // );
  // console.log(currentUser);

  if (!parsedUser) {
    console.log("user not logged in", parsedUser);
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <Header />
          <Outlet />
        </div>
      </div>
    </>
  );
}
