
/**
 * Formata um preço para exibição em AOA
 */
export function formatPrice(price: number, currency: string = 'AOA'): string {
    return new Intl.NumberFormat('pt-AO', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price) + ' ' + currency;
}

/**
 * Formata uma data para exibição
 */
export function formatDate(dateString: string, format: 'short' | 'long' | 'relative' = 'short'): string {
    const date = new Date(dateString);

    if (format === 'relative') {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hoje';
        if (diffDays === 1) return 'Ontem';
        if (diffDays < 7) return `Há ${diffDays} dias`;
        if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
        if (diffDays < 365) return `Há ${Math.floor(diffDays / 30)} meses`;
        return `Há ${Math.floor(diffDays / 365)} anos`;
    }

    if (format === 'long') {
        return date.toLocaleDateString('pt-AO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }

    return date.toLocaleDateString('pt-AO', {
        day: 'numeric',
        month: 'short',
    });
}

/**
 * Formata uma hora
 */
export function formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('pt-AO', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Trunca texto com ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

/**
 * Gera um ID único
 */
export function generateId(prefix: string = ''): string {
    return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), wait);
    };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let lastFunc: NodeJS.Timeout | null = null;
    let lastRan: number | null = null;

    return (...args: Parameters<T>) => {
        if (!lastRan) {
            func(...args);
            lastRan = Date.now();
        } else {
            if (lastFunc) clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan! >= limit) {
                    func(...args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

/**
 * Valida um email
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida um número de telefone angolano
 */
export function isValidAngolaPhone(phone: string): boolean {
    const phoneRegex = /^(\+244|244)?9[1-9]\d{7}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Classnames helper (similar to clsx)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

/**
 * Capitaliza a primeira letra
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Sleep utility para async/await
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
