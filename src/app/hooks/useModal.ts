import { useQueryState } from 'nuqs';

export type ModalState = 'create' | 'edit' | 'delete' | 'players' | null;

export function useModal() {
  const [modalState, setModalState] = useQueryState("modal", {
    parse: (value: string | null) => value as ModalState,
    serialize: (value: string | null) => value || "",
  });

  const openCreateModal = () => setModalState('create');
  const openEditModal = () => setModalState('edit');
  const openDeleteModal = () => setModalState('delete');
  const openPlayersModal = () => setModalState('players');
  const closeModal = () => setModalState(null);

  return {
    modalState,
    setModalState,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    openPlayersModal,
    closeModal,
  };
}
