"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { LoginForm } from "@/components/auth/LoginForm";
import { Header } from "@/components/Header";
import { PlayerList } from "@/components/players/PlayerList";

export default function Home() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isTeamFormOpen, setIsTeamFormOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto px-4 py-8">
        <LoginForm />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Players List</h2>
          <PlayerList />
        </section>
      </main>
    </div>
  );
}
