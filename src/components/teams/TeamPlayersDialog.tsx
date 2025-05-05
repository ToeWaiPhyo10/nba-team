"use client";

import { useDispatch } from "react-redux";
import { removePlayerFromTeam } from "@/store/teamSlice";
import { Team, Player } from "@/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface TeamPlayersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team;
}

export function TeamPlayersDialog({
  open,
  onOpenChange,
  team,
}: TeamPlayersDialogProps) {
  const dispatch = useDispatch();

  const handleRemovePlayer = (player: Player) => {
    dispatch(removePlayerFromTeam({ teamId: team.id, playerId: player.id }));
    toast.success(`${player.full_name} removed from ${team.full_name}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{team.full_name} Players</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] rounded-md border p-4">
          {team.players.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No players in this team yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>{player.full_name}</TableCell>
                    <TableCell>{player.position}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemovePlayer(player)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
