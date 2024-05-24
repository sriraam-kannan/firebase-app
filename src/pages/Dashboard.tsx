import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

export default function Dashboard() {
  const { user, signOutUser }: any = useFirebaseAuth();

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <button onClick={signOutUser}>Sign out</button>
    </div>
  );
}
