export const reducerForSearchResult = (state, action) => {
  if (action.type === "loading") {
    return {
      searchResult: [],
      isLoading: true,
      text: "Loading...",
      isError: false,
    };
  } else if (action.type === "success") {
    return {
      ...state,
      isLoading: false,
      searchResult: action.searchResult,
      isError: false,
    };
  } else if (action.type === "error") {
    return {
      ...state,
      text: "No results found",
      isLoading: false,
      isError: true,
    };
  } else if (action.type === "initial") {
    return {
      searchResult: [],
      isLoading: true,
      text: "",
      isError: false,
    };
  }
  return state;
};
