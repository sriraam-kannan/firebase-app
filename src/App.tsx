import { BrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider, useFirebaseAuth } from "./hooks/useFirebaseAuth";
import { appRouter } from "./AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  // const { user, loading }: any = useFirebaseAuth();

  // console.log(user);

  // if (!user && loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    // <BrowserRouter>
    //   {user ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
    // </BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={appRouter} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
export default App;
