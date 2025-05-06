"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { LoginForm } from "@/components/auth/LoginForm";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        className="container mx-auto px-4 flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-12">
            NBA Teams App
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              size="lg"
              variant="default"
              className="w-full text-lg py-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
              onClick={() => router.push("/players")}
            >
              Browse Players
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full text-lg py-6 border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 shadow-lg hover:shadow-xl"
              onClick={() => router.push("/teams")}
            >
              Manage Teams
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
