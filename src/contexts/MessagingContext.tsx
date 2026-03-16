
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, Notification } from '../shared/types';
import { messagesService } from '../services';
import { useAuth } from './AuthContext';

interface MessagingContextType {
    messages: Message[];
    notifications: Notification[];
    isLoading: boolean;
    actions: {
        sendMessage: (listingId: string, receiverId: string, content: string) => Promise<void>;
        markAsRead: (messageId: string) => Promise<void>;
        clearNotifications: () => void;
    };
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const data = await messagesService.getByUser(user.id);
                setMessages(data);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [user?.id]);

    const sendMessage = async (listingId: string, receiverId: string, content: string) => {
        if (!user) return;
        const newMessage = await messagesService.send({
            listingId,
            senderId: user.id,
            receiverId,
            content,
            isRead: false
        });
        setMessages(prev => [newMessage, ...prev]);
    };

    const markAsRead = async (messageId: string) => {
        // Implement logic to mark message as read
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isRead: true } : m));
    };

    const clearNotifications = () => setNotifications([]);

    const value = {
        messages,
        notifications,
        isLoading,
        actions: { sendMessage, markAsRead, clearNotifications }
    };

    return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>;
};

export const useMessaging = () => {
    const context = useContext(MessagingContext);
    if (!context) throw new Error('useMessaging must be used within MessagingProvider');
    return context;
};
