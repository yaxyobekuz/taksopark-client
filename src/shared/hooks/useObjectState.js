// React
import { useCallback, useState } from "react";

const useObjectState = (initialState = {}) => {
  const [state, setState] = useState(initialState);
  const [savedInitialState] = useState(initialState);

  const setField = useCallback((key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setFields = useCallback((updates = {}) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState(savedInitialState);
  }, [savedInitialState]);

  return { ...state, state, setField, setFields, resetState };
};

export default useObjectState;
