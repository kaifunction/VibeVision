import { createContext, useContext, useState } from "react";

const SearchResultsContext = createContext(null);

// 上下文提供者组件
export const SearchResultsProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <SearchResultsContext.Provider value={{ searchResults, setSearchResults }}>
      {children}
    </SearchResultsContext.Provider>
  );
};

// 使用上下文的Hook
export const useSearchResults = () => useContext(SearchResultsContext);
