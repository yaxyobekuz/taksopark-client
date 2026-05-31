// React
import { useEffect } from "react";

// Hooks
import useModal from "@/shared/hooks/useModal";

// Constants
import { MODAL } from "@/shared/constants/modals";

// Ctrl/Cmd + K bilan global qidiruv modalini ochadi
const useGlobalSearchHotkey = () => {
  const { openModal } = useModal();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        openModal(MODAL.GLOBAL_SEARCH);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openModal]);
};

export default useGlobalSearchHotkey;
