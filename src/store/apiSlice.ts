"use client";

import { createApi } from "@reduxjs/toolkit/query/react";
import { Player } from "@/types";
import { BalldontlieAPI } from "@balldontlie/sdk";

const balldontlieApi = new BalldontlieAPI({
  apiKey: process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY || "",
});

type PlayersDataResponse = {
  data: Player[];
  meta: {
    next_cursor?: number;
    prev_cursor?: number;
    per_page: number;
  };
};

type PlayersResponse = {
  data: PlayersDataResponse;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: async (args) => {
    try {
      return { data: args };
    } catch (error) {
      return { error };
    }
  },
  endpoints: (builder) => ({
    getPlayers: builder.query<
      PlayersResponse,
      { cursor?: number; per_page?: number; search?: string }
    >({
      async queryFn(arg) {
        const { cursor, per_page = 10, search } = arg || {};

        try {
          const response = await balldontlieApi.nba.getPlayers({
            per_page,
            search,
            cursor,
          });

          const players = response.data.map((player) => ({
            id: player.id,
            first_name: player.first_name,
            last_name: player.last_name,
            full_name: `${player.first_name} ${player.last_name}`,
            position: player.position,
            team: {
              id: player.team.id,
              full_name: player.team.name,
              city: player.team.city,
            },
          }));

          const meta = response.meta || {
            next_cursor: undefined,
            per_page: 10,
          };
          const playersData: PlayersDataResponse = {
            data: players,
            meta: {
              next_cursor: meta.next_cursor,
              prev_cursor: undefined,
              per_page: meta.per_page,
            },
          };

          return { data: { data: playersData } };
        } catch (error) {
          const serializedError = {
            message:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
            status: (error as { status?: number })?.status || 500,
            name: error instanceof Error ? error.name : "Error",
          };
          return { error: serializedError };
        }
      },
      serializeQueryArgs: ({ queryArgs }) => {
        return queryArgs.search || "";
      },
      merge: (currentCache, newItems) => {
        if (!currentCache) return newItems;

        return {
          data: {
            data: [...currentCache.data.data, ...newItems.data.data],
            meta: newItems.data.meta,
          },
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.cursor !== previousArg?.cursor;
      },
    }),
    getPlayerById: builder.query<Player, number>({
      async queryFn(id) {
        try {
          const response = await balldontlieApi.nba.getPlayer(id);

          if (!response.data) {
            return { error: "Player not found" };
          }
          const player = response.data;
          return {
            data: {
              id: player.id,
              first_name: player.first_name,
              last_name: player.last_name,
              full_name: `${player.first_name} ${player.last_name}`,
              position: player.position,
              team: {
                id: player.team.id,
                full_name: player.team.name,
                city: player.team.city,
              },
            },
          };
        } catch (error) {
          const serializedError = {
            message:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
            status: (error as { status?: number })?.status || 500,
            name: error instanceof Error ? error.name : "Error",
          };
          return { error: serializedError };
        }
      },
    }),
  }),
});

export const { useGetPlayersQuery, useGetPlayerByIdQuery } = apiSlice;
