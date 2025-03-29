import React, { createContext, useState } from 'react';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactionUpdate, setTransactionUpdate] = useState(0); // State để theo dõi khi giao dịch thay đổi

  const updateTransactions = () => {
    setTransactionUpdate(prev => prev + 1); // Tăng giá trị để kích hoạt lại useEffect
  };

  return (
    <TransactionContext.Provider value={{ transactionUpdate, updateTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};