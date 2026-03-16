
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useListings } from '../../../contexts/ListingsContext';
import { useMessaging } from '../../../contexts/MessagingContext';
import { Listing, User } from '../../../shared/types';
import { usersService } from '../../../services';

export const useListingDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { listings } = useListings();
    const { messages, actions: messagingActions } = useMessaging();

    const [listing, setListing] = useState<Listing | null>(null);
    const [owner, setOwner] = useState<User | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isContractOpen, setIsContractOpen] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (id) {
            const foundListing = listings.find(l => l.id === id);
            if (foundListing) {
                setListing(foundListing);
                const fetchOwner = async () => {
                    const foundOwner = await usersService.getById(foundListing.ownerId);
                    setOwner(foundOwner);
                };
                fetchOwner();
            }
        }
    }, [id, listings]);

    const handleContact = () => {
        if (!user) {
            navigate('/auth', { state: { from: { pathname: `/listing/${id}` } } });
            return;
        }
        setIsChatOpen(true);
    };

    const handleAction = () => {
        if (!user) {
            navigate('/auth', { state: { from: { pathname: `/listing/${id}` } } });
            return;
        }
        setIsContractOpen(true);
    };

    const chatMessages = messages.filter(m =>
        m.listingId === listing?.id &&
        user &&
        ((m.senderId === user.id && m.receiverId === owner?.id) ||
            (m.senderId === owner?.id && m.receiverId === user.id))
    );

    const handleSendMessage = async () => {
        if (!listing || !owner || !message.trim()) return;
        await messagingActions.sendMessage(listing.id, owner.id, message);
        setMessage('');
    };

    return {
        listing, owner, activeImageIndex, setActiveImageIndex,
        isChatOpen, setIsChatOpen, isContractOpen, setIsContractOpen,
        message, setMessage,
        handleContact, handleAction, handleSendMessage,
        chatMessages,
        user,
        navigate
    };
};
