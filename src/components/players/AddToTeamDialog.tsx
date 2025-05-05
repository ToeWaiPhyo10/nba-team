"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { Player, Team } from "@/types";
import { addPlayerToTeam, removePlayerFromTeam } from "@/store/teamSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";
import { PersonIcon } from "@radix-ui/react-icons";

interface AddToTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player;
}

export function AddToTeamDialog({
  open,
  onOpenChange,
  player,
}: AddToTeamDialogProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const teams = useSelector((state: RootState) => state.teams.teams);

  const getPlayerTeam = (playerId: number): Team | undefined => {
    return teams.find((team: Team) =>
      team.players.some((p: Player) => p.id === playerId)
    );
  };

  const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>(
    getPlayerTeam(player.id)?.id.toString()
  );

  const handleSave = () => {
    if (!selectedTeamId) return;

    const currentTeam = getPlayerTeam(player.id);
    const newTeam = teams.find((t: Team) => t.id === parseInt(selectedTeamId));

    if (currentTeam) {
      dispatch(
        removePlayerFromTeam({ teamId: currentTeam.id, playerId: player.id })
      );
    }

    if (newTeam) {
      dispatch(addPlayerToTeam({ teamId: parseInt(selectedTeamId), player }));
      toast.success(`Added ${player.full_name} to ${newTeam.full_name}`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add {player.full_name} to Team</DialogTitle>
        </DialogHeader>
        {teams.length > 0 ? (
          <>
            <div className="py-6">
              <div className="space-y-2 ">
                <Label>Select Team</Label>
                <Select
                  onValueChange={setSelectedTeamId}
                  value={selectedTeamId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team: Team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.full_name} ({team.players.length} players)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} disabled={!selectedTeamId}>
                Save Changes
              </Button>
            </DialogFooter>
          </>
        ) : (
          <EmptyState
            icon={<PersonIcon className="w-8 h-8" />}
            title="No Teams Available"
            description="Create a team first before adding players."
            action={{
              label: "Create Team",
              onClick: () => {
                onOpenChange(false);
                router.push("/teams");
              },
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
