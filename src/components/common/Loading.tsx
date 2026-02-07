
import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    text,
    fullScreen = false
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div
                className={`${sizeClasses[size]} rounded-full border-blue-200 border-t-blue-600 animate-spin`}
            />
            {text && (
                <p className="text-gray-500 text-sm font-medium animate-pulse">{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
};

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rectangular' | 'circular';
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular'
}) => {
    const baseClasses = 'bg-gray-200 animate-pulse';

    const variantClasses = {
        text: 'h-4 rounded',
        rectangular: 'rounded-xl',
        circular: 'rounded-full',
    };

    return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />;
};

export const ListingCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <Skeleton className="h-64 w-full" />
        <div className="p-6 space-y-4">
            <div className="flex justify-between">
                <Skeleton className="h-6 w-2/3" variant="text" />
                <Skeleton className="h-6 w-1/4" variant="text" />
            </div>
            <Skeleton className="h-4 w-1/2" variant="text" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
            </div>
            <div className="pt-4 border-t flex justify-between">
                <Skeleton className="h-4 w-1/3" variant="text" />
                <Skeleton className="h-4 w-1/4" variant="text" />
            </div>
        </div>
    </div>
);

export const PageSkeleton: React.FC = () => (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-6 w-1/2" variant="text" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ListingCardSkeleton />
            <ListingCardSkeleton />
            <ListingCardSkeleton />
        </div>
    </div>
);
