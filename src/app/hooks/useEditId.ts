import { useQueryState } from 'nuqs';

export function useEditId() {
  const [editTeamId, setEditTeamId] = useQueryState("edit", {
    parse: (value: string | null) => value,
    serialize: (value: string | null) => value || "",
  });

  const setEditId = (id: string | null) => setEditTeamId(id);
  const clearEditId = () => setEditTeamId(null);

  return {
    editTeamId,
    setEditId,
    clearEditId,
  };
}
