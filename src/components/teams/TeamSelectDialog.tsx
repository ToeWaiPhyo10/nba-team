"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addPlayerToTeam, removePlayerFromTeam } from "@/store/teamSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Player, Team } from "@/types";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

interface TeamSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player;
}

export function TeamSelectDialog({
  open,
  onOpenChange,
  player,
}: TeamSelectDialogProps) {
  const dispatch = useDispatch();
  const teams = useSelector((state: RootState) => state.teams.teams);

  const handleAddToTeam = (team: Team) => {
    if (team.players.some((p) => p.id === player.id)) {
      toast.error(`${player.full_name} is already in ${team.full_name}`);
      return;
    }

    dispatch(addPlayerToTeam({ teamId: team.id, player }));
    toast.success(`Added ${player.full_name} to ${team.full_name}`);
  };

  const handleRemoveFromTeam = (team: Team) => {
    dispatch(removePlayerFromTeam({ teamId: team.id, playerId: player.id }));
    toast.success(`Removed ${player.full_name} from ${team.full_name}`);
  };

  const isPlayerInTeam = (team: Team) => {
    return team.players.some((p) => p.id === player.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {player.full_name} to Team</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {teams.map((team: Team) => (
              <Card key={team.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{team.full_name}</h3>
                      <CardDescription>
                        Players: {team.players.length}
                      </CardDescription>
                    </div>
                    {isPlayerInTeam(team) ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveFromTeam(team)}
                      >
                        <MinusIcon className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAddToTeam(team)}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {teams.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No teams available. Create a team first.
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
