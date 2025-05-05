"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { removePlayerFromTeam } from "@/store/teamSlice";
import { Player } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function TeamPlayers() {
  const dispatch = useDispatch();
  const selectedTeam = useSelector(
    (state: RootState) => state.teams.selectedTeam
  );

  const handleRemovePlayer = (playerId: number) => {
    if (!selectedTeam) return;

    dispatch(removePlayerFromTeam({ teamId: selectedTeam.id, playerId }));
    toast.success("Player removed from team");
  };

  if (!selectedTeam) {
    return (
      <div className="text-center p-4">
        <p>Select a team to view its players</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{selectedTeam.name} Players</h3>
      {selectedTeam.players.length === 0 ? (
        <p>No players in this team</p>
      ) : (
        selectedTeam.players.map((player: Player) => (
          <Card key={player.id} className="mb-4">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  {player.first_name} {player.last_name}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemovePlayer(player.id)}
                >
                  Remove
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Position: {player.position || "N/A"}</p>
              <p>Original Team: {player.team.full_name}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
