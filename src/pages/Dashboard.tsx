import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Dashboard() {
  const user = useCurrentUser();
  const loginId = user?.currentUser?.signInDetails?.loginId;
  console.log(loginId);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Welcome, {loginId}
        </h1>
      </div>
    </main>
  );
}
