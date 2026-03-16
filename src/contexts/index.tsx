
import React from 'react';
import { AuthProvider } from './AuthContext';
import { ListingsProvider } from './ListingsContext';
import { MessagingProvider } from './MessagingContext';
import { AccountProvider } from './AccountContext';

import { UserProvider } from './UserContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AuthProvider>
            <UserProvider>
                <ListingsProvider>
                    <MessagingProvider>
                        <AccountProvider>
                            {children}
                        </AccountProvider>
                    </MessagingProvider>
                </ListingsProvider>
            </UserProvider>
        </AuthProvider>
    );
};
