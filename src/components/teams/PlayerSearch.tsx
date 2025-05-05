'use client';

import { useState } from 'react';
import { Player } from '@/types';

type PlayerResponse = {
  data: Player[];
  meta: {
    next_cursor?: number;
    previous_cursor?: number;
  };
};
import { useGetPlayersQuery } from '@/store/apiSlice';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function PlayerSearch({ onSelectPlayer }: { onSelectPlayer: (player: Player) => void }) {
  const [page, setPage] = useState<number>(1);
  const { data, error, isLoading, isFetching } = useGetPlayersQuery({
    page,
    per_page: 10
  });

  if (error) {
    return <div>Error loading players</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Available Players</h3>
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid gap-2">
              {data?.data.map((player: Player) => (
                <Button
                  key={player.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onSelectPlayer(player)}
                >
                  {player.first_name} {player.last_name} - {player.team.full_name}
                </Button>
              ))}
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setPage(data?.meta?.prev_page || 1)}
                disabled={!data?.meta?.prev_page || isFetching}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(data?.meta?.next_page || 1)}
                disabled={!data?.meta?.next_page || isFetching}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
