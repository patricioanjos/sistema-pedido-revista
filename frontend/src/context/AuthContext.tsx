import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Session, User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface AuthState {
    user: User | null;
    session: Session | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthContextType extends AuthState {
    login: (session: Session, user: User) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    login: () => { },
    logout: () => { },
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        try {
            const storedSession = localStorage.getItem(`sb-${import.meta.env.VITE_SUPABASE_NAME}-auth-token`);
            if (storedSession) {
                const parsedSession: Session = JSON.parse(storedSession);
                setSession(parsedSession);
                setUser(parsedSession.user || null);
                setIsAuthenticated(!!parsedSession.access_token);
            }
        } catch (error) {
            console.error("Erro ao carregar sessão do localStorage:", error);
            localStorage.removeItem(`sb-${import.meta.env.VITE_SUPABASE_NAME}-auth-token`);
        } finally {
            // setIsLoading(false)
        }


        const { data: {subscription} } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log('Supabase Auth State Change:', event)
                setSession(session);
                setUser(session?.user || null);
                setIsAuthenticated(!!session?.access_token);
                setIsLoading(false)
            }
        );

        // O Supabase tem um método para obter a sessão atual no início
        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            setSession(initialSession);
            setUser(initialSession?.user || null);
            setIsAuthenticated(!!initialSession?.access_token);
            setIsLoading(false)
        }).catch(error => {
            console.error("Erro ao obter sessão inicial do Supabase:", error);
            setIsLoading(false)
        });


        // Limpeza do listener ao desmontar o componente
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

    const login = async (newSession: Session, newUser: User) => {
        const { error } = await supabase.auth.setSession({
            access_token: newSession.access_token,
            refresh_token: newSession.refresh_token
        });

        if (error) {
            console.error("Erro ao definir sessão no cliente Supabase:", error.message);
            throw new Error("Não foi possível persistir a sessão de login.");
        }

        // setSession(newSession)
        setUser(newUser)
        setIsAuthenticated(true)
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Erro ao fazer logout no Supabase:", error.message);
        }
    };

    const contextValue: AuthContextType = {
        user,
        session,
        isAuthenticated,
        isLoading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};