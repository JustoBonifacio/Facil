
import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useMessaging } from '../../../contexts/MessagingContext';
import { useListings } from '../../../contexts/ListingsContext';
import { Message, User, Listing } from '../../../shared/types';
import { usersService } from '../../../services';

export interface Conversation {
    otherUser: User;
    listing: Listing | null;
    lastMessage: Message;
    messages: Message[];
    unreadCount: number;
}

export const useInbox = () => {
    const { user } = useAuth();
    const { messages, actions: messagingActions } = useMessaging();
    const { listings } = useListings();
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsers, setAllUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await usersService.getAll();
            setAllUsers(users);
        };
        fetchUsers();
    }, []);

    const conversations = useMemo<Conversation[]>(() => {
        if (!user) return [];

        const userMessages = messages.filter(m =>
            m.senderId === user.id || m.receiverId === user.id
        );

        const conversationMap = new Map<string, Message[]>();

        userMessages.forEach(message => {
            const otherUserId = message.senderId === user.id ? message.receiverId : message.senderId;
            const key = `${otherUserId}-${message.listingId}`;
            if (!conversationMap.has(key)) conversationMap.set(key, []);
            conversationMap.get(key)!.push(message);
        });

        return Array.from(conversationMap.entries()).map(([key, msgs]) => {
            const [otherUserId, listingId] = key.split('-');
            const otherUser = allUsers.find(u => u.id === otherUserId);
            const listing = listings.find(l => l.id === listingId) || null;
            
            if (!otherUser) return null;

            const sortedMessages = [...msgs].sort((a, b) =>
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
            const lastMessage = sortedMessages[sortedMessages.length - 1];

            return {
                otherUser,
                listing,
                lastMessage,
                messages: sortedMessages,
                unreadCount: 0,
            };
        })
        .filter((c): c is Conversation => c !== null)
        .sort((a, b) =>
            new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
        ).filter(c =>
            c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.listing?.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [messages, user, allUsers, listings, searchQuery]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        await messagingActions.sendMessage(
            selectedConversation.listing?.id || '',
            selectedConversation.otherUser.id,
            newMessage
        );
        setNewMessage('');
    };

    return {
        conversations,
        selectedConversation, setSelectedConversation,
        newMessage, setNewMessage,
        searchQuery, setSearchQuery,
        handleSendMessage,
        user
    };
};
