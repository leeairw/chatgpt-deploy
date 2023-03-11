// import React, { createContext, useState } from 'react';

// type ChatDataType = { role: string, message: string }[];
// type ChatDataContextType = { chatData: ChatDataType, setChatData: React.Dispatch<React.SetStateAction<ChatDataType>> };

// const ChatDataContext = createContext<ChatDataContextType>({
//   chatData: [],
//   setChatData: () => {},
// });

// type Props = {
//     children: React.ReactNode;
// }

// export const ChatDataProvider: React.FC = ({children}: Props) => {
//   const [chatData, setChatData] = useState<ChatDataType>([]);

//   return (
//     <ChatDataContext.Provider value={{ chatData, setChatData }}>
//       {children}
//     </ChatDataContext.Provider>
//   );
// };
