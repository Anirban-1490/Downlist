export const reducerForSearchResult = (state, action) => {
  if (action.type === "loading") {
    return {
      ...state,
      text: "Loading...",
    };
  } else if (action.type === "success") {
    return {
      ...state,
      isLoading: action.isLoading,
      searchResult: action.searchResult,
    };
  } else if (action.type === "error") {
    return { ...state, text: "No results found" };
  } else if (action.type === "initial") {
    return {
      searchResult: [],
      isLoading: true,
      text: "",
    };
  }
  return state;
};
