"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Player, Team } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfiniteScroll from "react-infinite-scroll-component";
import { useGetPlayersQuery } from "@/store/apiSlice";
import { AddToTeamDialog } from "@/components/players/AddToTeamDialog";
import { LoadingSkeleton } from "../LoadingSkeleton";

export function PlayerList() {
  const teams = useSelector((state: RootState) => state.teams.teams);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { data, isLoading, error } = useGetPlayersQuery(
    { cursor, per_page: 10 },
    { pollingInterval: 0 }
  );

  const loadMore = () => {
    if (data?.data.meta.next_cursor) {
      setCursor(data.data.meta.next_cursor);
    }
  };

  const getPlayerTeam = (playerId: number): Team | undefined => {
    return teams.find((team: Team) =>
      team.players.some((p: Player) => p.id === playerId)
    );
  };

  const handleAddToTeam = (player: Player) => {
    setSelectedPlayer(player);
  };

  return (
    <>
      <InfiniteScroll
        data-posts-count={data?.data.data.length || 0}
        dataLength={data?.data.data.length || 0}
        next={loadMore}
        hasMore={
          !!(data?.data.meta.next_cursor && data.data.meta.next_cursor < 100)
        }
        loader={<LoadingSkeleton />}
        endMessage={
          <div className="text-center py-4 text-gray-500">
            No more players to load
          </div>
        }
        scrollableTarget="players-scroll"
      >
        {isLoading && !data ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            Error loading players. Please try again.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.data.data.map((player: Player) => (
              <Card key={player.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>
                    {player.first_name} {player.last_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{player.position}</p>
                  <p className="text-sm text-gray-500">
                    {player.team.full_name} ({player.team.city})
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => handleAddToTeam(player)}
                  >
                    {getPlayerTeam(player.id) ? "Change Team" : "Add to Team"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </InfiniteScroll>

      {selectedPlayer && (
        <AddToTeamDialog
          open={!!selectedPlayer}
          onOpenChange={(open) => !open && setSelectedPlayer(null)}
          player={selectedPlayer}
        />
      )}
    </>
  );
}
