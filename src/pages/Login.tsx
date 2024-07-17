import { Link, redirect } from "react-router-dom";
import { getCurrentUser, signIn } from "aws-amplify/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const onClickLogin = async (event: any) => {
    event.preventDefault();
    const user: any = localStorage.getItem("neouser");
    const parsedUser = JSON.parse(user);
    if (parsedUser) {
      console.log("redirect");
      redirect("/");
      return;
    }
    const form = event.currentTarget;
    const signInoptions = await signIn({
      username: form.elements.email.value,
      password: form.elements.password.value,
    });
    console.log(signInoptions);
    const currentUser = await getCurrentUser();
    localStorage.setItem("neouser", JSON.stringify(currentUser));
  };

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <form className="grid gap-4" onSubmit={onClickLogin}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="ml-auto inline-block text-sm underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/" className="underline">
          Register
        </Link>
      </div>
    </div>
  );
}
