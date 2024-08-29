import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN': {
            const { profile } = action.payload;
            localStorage.setItem('user', JSON.stringify({ profile }));
            return { ...state, isLoggedIn: true, profile };
        }
        case 'LOGOUT': {
            localStorage.removeItem('user');
            return { ...state, isLoggedIn: false, profile: null };
        }
        case 'SET_PROFILE': {
            return { ...state, profile: action.payload };
        }
        default: {
            return { ...state };
        }
    }
};

export const AuthProvider = ({ children }) => {
    const [user, dispatch] = useReducer(reducer, {
        isLoggedIn: false,
        profile: null,
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.profile) {
            console.log('Stored User:', storedUser);
            dispatch({ type: 'LOGIN', payload: storedUser });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
