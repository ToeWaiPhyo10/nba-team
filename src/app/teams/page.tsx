"use client";

import { Header } from "@/components/Header";
import { TeamList } from "@/components/teams/TeamList";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { useModal } from "@/app/hooks/useModal";
import { useEditId } from "@/app/hooks/useEditId";
import { TeamForm } from "@/components/teams/TeamForm";
import { Team } from "@/types";
import { PlusIcon } from "lucide-react";

export default function TeamsPage() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const { modalState, closeModal, openCreateModal } = useModal();
  const { editTeamId, clearEditId } = useEditId();
  const teams = useSelector((state: RootState) => state.teams.teams);

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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Teams</h1>
            <Button onClick={openCreateModal} size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </div>
          <TeamList />
        </section>
      </main>
      {modalState === "create" && (
        <TeamForm open={modalState == "create"} onOpenChange={closeModal} />
      )}

      {modalState === "edit" && editTeamId && (
        <TeamForm
          open={modalState == "edit"}
          onOpenChange={() => {
            closeModal();
            clearEditId();
          }}
          team={teams.find((t: Team) => t.id.toString() === editTeamId) || null}
        />
      )}
    </div>
  );
}
