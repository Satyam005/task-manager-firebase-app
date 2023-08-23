import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { auth } from "./firebase";

interface AuthUser {
  uid: string;
  email: string;
  userName: string;
}

interface AuthContextProps {
  authUser: AuthUser | null;
  isLoading: boolean;
  setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  signOut: () => void;
}

const AuthUserContext = createContext<AuthContextProps>({
  authUser: null,
  isLoading: true,
  setAuthUser: () => {},
  signOut: () => {},
});

export default function useFirebaseAuth(): AuthContextProps {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const clear = () => {
    setAuthUser(null);
    setIsLoading(false);
  };
  const authStateChanged = async (user: any) => {
    setIsLoading(true);

    if (!user) {
      clear();
      return;
    }
    console.log(user);
    setAuthUser({
      uid: user.uid,
      email: user.email,
      userName: user.displayName,
    });
    setIsLoading(false);
  };

  const signOut = () => {
    authSignOut(auth).then(() => clear());
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  return { authUser, isLoading, setAuthUser, signOut };
}

export const AuthUserProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const auth = useFirebaseAuth();
  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => useContext(AuthUserContext);
