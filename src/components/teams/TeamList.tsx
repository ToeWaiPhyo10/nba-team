"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "@/app/hooks/useModal";
import { useEditId } from "@/app/hooks/useEditId";
import { RootState } from "@/store";
import { Team } from "@/types";
import { Button } from "@/components/ui/button";
import { DeleteTeamDialog } from "./DeleteTeamDialog";
import { TeamPlayersDialog } from "./TeamPlayersDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PlusIcon } from "@radix-ui/react-icons";
import { EmptyState } from "@/components/ui/empty-state";
import { PersonIcon } from "@radix-ui/react-icons";
import { TeamForm } from "./TeamForm";
import { useRouter } from "next/navigation";
import { deleteTeam } from "@/store/teamSlice";

export function TeamList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const teams = useSelector((state: RootState) => state.teams.teams);
  const {
    modalState,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    openPlayersModal,
    closeModal,
  } = useModal();
  const { editTeamId, setEditId, clearEditId } = useEditId();
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [teamToShowPlayers, setTeamToShowPlayers] = useState<Team | null>(null);

  if (teams.length === 0) {
    return (
      <EmptyState
        icon={<PersonIcon className="w-8 h-8" />}
        title="No Teams Yet"
        description="Start by creating your first team."
        action={{
          label: "Create Team",
          onClick: openCreateModal,
        }}
      />
    );
  }

  const handleClose = () => {
    closeModal();
    clearEditId();
  };

  const handleEdit = (team: Team) => {
    setEditId(team.id.toString());
    openEditModal();
  };

  const handleDelete = (team: Team) => {
    setTeamToDelete(team);
    openDeleteModal();
  };

  const handleShowPlayers = (team: Team) => {
    setTeamToShowPlayers(team);
    openPlayersModal();
  };

  const handleCreateTeam = () => {
    openCreateModal();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team: Team) => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{team.full_name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleShowPlayers(team)}
                  >
                    Show Players
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(team)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(team)}
                  >
                    Delete
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Region:</span> {team.region}
              </div>
              <div className="text-sm">
                <span className="font-medium">City:</span> {team.city}
              </div>
              <div className="text-sm">
                <span className="font-medium">Numbers of Players:</span>{" "}
                {team.players.length}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TeamForm open={modalState === "create"} onOpenChange={closeModal} />

      {modalState === "edit" && editTeamId && (
        <TeamForm
          open={modalState === "edit"}
          onOpenChange={closeModal}
          team={teams.find((t: Team) => t.id.toString() === editTeamId) || null}
        />
      )}

      {modalState === "delete" && teamToDelete && (
        <DeleteTeamDialog
          open={modalState === "delete"}
          onOpenChange={(open) => {
            if (!open) {
              closeModal();
              setTeamToDelete(null);
            }
          }}
          team={teamToDelete}
        />
      )}

      {modalState === "players" && teamToShowPlayers && (
        <TeamPlayersDialog
          open={modalState === "players"}
          onOpenChange={(open) => {
            if (!open) {
              closeModal();
              setTeamToShowPlayers(null);
            }
          }}
          team={teamToShowPlayers}
        />
      )}
    </div>
  );
}
