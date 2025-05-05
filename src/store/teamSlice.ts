"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Team, Player } from "@/types";

export interface TeamState {
  teams: Team[];
  selectedTeam: Team | null;
}

const initialState: TeamState = {
  teams: [],
  selectedTeam: null,
};

const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
      localStorage.setItem("teams", JSON.stringify(state.teams));
    },
    updateTeam: (state, action: PayloadAction<Team>) => {
      const index = state.teams.findIndex(
        (team) => team.id === action.payload.id
      );
      if (index !== -1) {
        state.teams[index] = action.payload;
      }
      localStorage.setItem("teams", JSON.stringify(state.teams));
    },
    deleteTeam: (state, action: PayloadAction<number>) => {
      state.teams = state.teams.filter((team) => team.id !== action.payload);
      localStorage.setItem("teams", JSON.stringify(state.teams));
    },
    addPlayerToTeam: (
      state,
      action: PayloadAction<{ teamId: number; player: Player }>
    ) => {
      const team = state.teams.find((t) => t.id === action.payload.teamId);
      if (
        team &&
        !state.teams.some((t) =>
          t.players.some((p) => p.id === action.payload.player.id)
        )
      ) {
        team.players.push(action.payload.player);
        localStorage.setItem("teams", JSON.stringify(state.teams));
      }
    },
    removePlayerFromTeam: (
      state,
      action: PayloadAction<{ teamId: number; playerId: number }>
    ) => {
      const team = state.teams.find((t) => t.id === action.payload.teamId);
      if (team) {
        team.players = team.players.filter(
          (p) => p.id !== action.payload.playerId
        );
        localStorage.setItem("teams", JSON.stringify(state.teams));
      }
    },
    setSelectedTeam: (state, action: PayloadAction<Team | null>) => {
      state.selectedTeam = action.payload;
    },
  },
});

export const {
  addTeam,
  updateTeam,
  deleteTeam,
  addPlayerToTeam,
  removePlayerFromTeam,
  setSelectedTeam,
} = teamSlice.actions;

export default teamSlice.reducer;
