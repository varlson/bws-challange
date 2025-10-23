// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
//   type ReactNode,
// } from "react";
// import type { User } from "../types/types";
// import { AuthContext } from "./AppContexts";
// import Loader from "../components/ui/loader";
// import {
//   fetchCSRFToken,
//   getCSRFToken,
//   logOut,
//   setAccessToken,
// } from "../config/axios/config";
// import { GetMe } from "../services/users/users.services";

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   const logout = useCallback(async () => {
//     try {
//       const resp = await logOut();
//     } catch (err) {
//       // console.warn("Falha ao deslogar:", err);
//     } finally {
//       setUser(null);
//       setAccessToken(null);
//     }
//   }, []);

//   const login = useCallback(
//     (username: string, name: string, token?: string) => {
//       setUser({ name, usermame: username });
//       if (token) setAccessToken(token);
//     },
//     []
//   );

//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         const CSRFToken = getCSRFToken();
//         if (!CSRFToken) await fetchCSRFToken();

//         if (user) return;
//         const resp = await GetMe();
//         console.log({ resp });
//         if (resp.success) {
//           login(resp.data.username, resp.data.email);
//         } else {
//           logout();
//         }
//       } catch (err) {
//         logout();
//       } finally {
//         setLoading(false);
//       }
//     };

//     initAuth();
//   }, [login, logout]);

//   const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

//   return (
//     <AuthContext.Provider value={value}>
//       {loading ? (
//         <div className="h-screen flex justify-center items-center">
//           <Loader />
//         </div>
//       ) : (
//         children
//       )}
//     </AuthContext.Provider>
//   );
// }

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthContext } from "./AppContexts";
import Loader from "../components/ui/loader";
import {
  fetchCSRFToken,
  getCSRFToken,
  logOut,
  setAccessToken,
} from "../config/axios/config";
import { GetMe } from "../services/users/users.services";
import type { MeResponse } from "../services/users/users.models";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  /** ---- Funções estáveis ---- */
  const logout = useCallback(async () => {
    try {
      await logOut();
    } catch {
      // falha ao deslogar, ignorar
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  const loadLogedUser = useCallback(async () => {
    const resp = await GetMe();

    if (resp.success) {
      setUser(resp.data);
    } else {
      throw new Error(resp.error);
    }
  }, []);

  /** ---- Inicialização ---- */
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        // Evita chamadas duplicadas desnecessárias
        if (!getCSRFToken()) await fetchCSRFToken();

        // Evita reexecução se já autenticado
        if (user) return;

        await loadLogedUser();
        if (!isMounted) return;
      } catch {
        logout();
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []); // <- dependências removidas propositalmente

  /** ---- Memoização do contexto ---- */
  const value = useMemo(
    () => ({ user, logout, loadLogedUser }),
    [user, logout]
  );

  /** ---- Renderização ---- */
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
