import React, { createContext, useState } from 'react';

export const DiscussionsContext = createContext();

export function DiscussionsProvider({ children }) {
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);

  return (
    <DiscussionsContext.Provider value={{ selectedDiscussion, setSelectedDiscussion }}>
      {children}
    </DiscussionsContext.Provider>
  );
}

export default DiscussionsProvider;