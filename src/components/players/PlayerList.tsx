"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addPlayerToTeam } from "@/store/teamSlice";
import { Player, Team } from "@/types";
import { useGetPlayersQuery } from "@/store/apiSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import InfiniteScroll from "react-infinite-scroll-component";

export function PlayerList() {
  const dispatch = useDispatch();
  const selectedTeam = useSelector(
    (state: RootState) => state.teams.selectedTeam
  );
  const teams = useSelector((state: RootState) => state.teams.teams);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const { data, isLoading, isFetching, error } = useGetPlayersQuery(
    { cursor, per_page: 10 },
    { pollingInterval: 0 }
  );

  const loadMore = () => {
    if (data?.data.meta.next_cursor) {
      setCursor(data.data.meta.next_cursor);
    }
  };

  const isPlayerInAnyTeam = (playerId: number) => {
    return teams.some((team: Team) =>
      team.players.some((p: Player) => p.id === playerId)
    );
  };

  const handleAddToTeam = (player: Player) => {
    if (!selectedTeam) {
      toast.error("Please select a team first");
      return;
    }

    if (isPlayerInAnyTeam(player.id)) {
      toast.error("Player is already in a team");
      return;
    }

    dispatch(addPlayerToTeam({ teamId: selectedTeam.id, player }));
    toast.success(
      `Added ${player.first_name} ${player.last_name} to ${selectedTeam.full_name}`
    );
  };

  return (
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
                  disabled={isPlayerInAnyTeam(player.id)}
                  onClick={() => handleAddToTeam(player)}
                >
                  {isPlayerInAnyTeam(player.id) ? "In Team" : "Add to Team"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </InfiniteScroll>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="mb-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-8 w-[100px]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
