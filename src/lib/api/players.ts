import axios from "axios";
import { ApiResponse, Player } from "@/types";
import { BalldontlieAPI } from "@balldontlie/sdk";

const BASE_URL = "https://www.balldontlie.io/api/v1";

export const fetchPlayers = async (
  page: number = 1
): Promise<ApiResponse<Player>> => {
  try {
    const api = new BalldontlieAPI({
      apiKey: process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY || "",
    });
    const players = await api.nba.getPlayers({
      per_page: 10,
      cursor: 1,
    });
    console.log("players", players);
    return {
      data: [],
      meta: {
        current_page: 1,
        next_page: 1,
        total_pages: 1,
        per_page: 1,
        total_count: 1,
      },
    };

    // const response = await axios.get(`${BASE_URL}/players`, {
    //   params: {
    //     page,
    //     per_page: 10,
    //   },
    // });
    // return response.data;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
};
