// import React, { createContext, useContext, useState } from "react";

// interface AuthContextProps {
//   user: any;
//   login: (userData: any) => void;
//   logout: () => void;
// }

// // Use 'undefined' as the initial value to avoid type argument issues
// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// interface AuthProviderProps {
//   children: React.ReactElement | React.ReactElement[];
// }

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [user, setUser] = useState<any>(null);

//   const login = (userData: any) => {
//     setUser(userData);
//     localStorage.setItem("token", userData.token);
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("token");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use Auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
