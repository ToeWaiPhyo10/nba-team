"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { Team } from "@/types";
import { addTeam, updateTeam } from "@/store/teamSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { RootState } from "@/store";

const teamSchema = z.object({
  full_name: z.string().min(1, "Team name is required"),
  city: z.string().min(1, "City is required"),
  region: z.string().min(1, "Region is required"),
});

type FormData = z.infer<typeof teamSchema>;

interface TeamFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team?: Team | null;
}

export function TeamForm({ open, onOpenChange, team }: TeamFormProps) {
  const dispatch = useDispatch();
  const teams = useSelector((state: RootState) => state.teams.teams);

  const form = useForm<FormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      full_name: team?.full_name || "",
      city: team?.city || "",
      region: team?.region || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const teamExists = teams.some(
      (t: Team) =>
        t.full_name.toLowerCase() === data.full_name.toLowerCase() &&
        (!team || t.id !== team.id)
    );

    if (teamExists) {
      form.setError("full_name", { message: "Team name already exists" });
      return;
    }

    try {
      if (team) {
        dispatch(updateTeam({ ...team, ...data }));
        toast.success("Team updated successfully");
      } else {
        dispatch(
          addTeam({
            id: Date.now(),
            full_name: data.full_name,
            city: data.city,
            region: data.region,
            players: [],
          })
        );
        toast.success("Team created successfully");
      }
      onOpenChange(false);
      form.reset();
    } catch {
      toast.error("Failed to save team");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{team ? "Edit Team" : "Create New Team"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter team name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter region" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{team ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
