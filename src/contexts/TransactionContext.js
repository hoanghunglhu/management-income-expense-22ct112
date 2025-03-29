
import React, { createContext, useState } from 'react';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactionUpdate, setTransactionUpdate] = useState(false); // Sử dụng boolean

  return (
    <TransactionContext.Provider value={{ transactionUpdate, setTransactionUpdate }}>
      {children}
    </TransactionContext.Provider>
  );
};