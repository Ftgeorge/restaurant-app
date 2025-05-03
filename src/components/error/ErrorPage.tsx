"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { MdErrorOutline, MdLockOutline, MdWifiOff, MdWarning, MdAutorenew } from "react-icons/md";
import { FaServer, FaUserLock, FaExclamationTriangle } from "react-icons/fa";

type ErrorCode = 401 | 403 | 404 | 500 | 503 | 'offline' | 'default';

interface ErrorTypeConfig {
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
}

interface ErrorTypes {
    [key: string]: ErrorTypeConfig;
}

const errorTypes: ErrorTypes = {
    401: {
        title: "Unauthorized Access",
        description: "You don't have permission to access this page. Please log in or contact your administrator.",
        icon: FaUserLock,
        color: "text-yellow-500",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200"
    },
    403: {
        title: "Access Forbidden",
        description: "You don't have sufficient permissions to access this resource.",
        icon: MdLockOutline,
        color: "text-orange-500",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200"
    },
    404: {
        title: "Page Not Found",
        description: "The page you're looking for doesn't exist or has been moved.",
        icon: MdErrorOutline,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
    },
    500: {
        title: "Server Error",
        description: "Something went wrong on our servers. We're working to fix the issue.",
        icon: FaServer,
        color: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200"
    },
    503: {
        title: "Service Unavailable",
        description: "The service is temporarily unavailable. Please try again later.",
        icon: MdAutorenew,
        color: "text-purple-500",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200"
    },
    offline: {
        title: "No Internet Connection",
        description: "Please check your internet connection and try again.",
        icon: MdWifiOff,
        color: "text-gray-500",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200"
    },
    default: {
        title: "Something Went Wrong",
        description: "An unexpected error occurred. Please try again or contact support.",
        icon: FaExclamationTriangle,
        color: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200"
    }
};

export interface ErrorPageProps {
    statusCode?: number;
    error?: Error | string;
    customTitle?: string;
    customDescription?: string;
    redirectPath?: string;
    onRetry?: () => void;
}

export default function ErrorPage({ 
    statusCode, 
    error,
    customTitle,
    customDescription,
    redirectPath = '/',
    onRetry
}: ErrorPageProps) {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(true);
    const [countdown, setCountdown] = useState(10);
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Determine error type based on status code or default
    const errorTypeKey = statusCode ? statusCode.toString() as keyof typeof errorTypes : 'default';
    const errorType = errorTypes[errorTypeKey] || errorTypes.default;

    // Check if offline and override error type
    const displayedError = !isOnline ? errorTypes.offline : errorType;

    // Apply custom title and description if provided
    const title = customTitle || displayedError.title;
    const description = customDescription || displayedError.description;
    const { icon: Icon, color, bgColor, borderColor } = displayedError;

    // Check online status
    useEffect(() => {
        const handleOnlineStatus = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        // Set initial online status
        setIsOnline(navigator.onLine);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    // Auto-redirect countdown for 404 errors
    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;

        if (statusCode === 404 && countdown > 0 && isRedirecting) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (countdown === 0 && isRedirecting) {
            router.push(redirectPath);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [countdown, router, statusCode, isRedirecting, redirectPath]);

    const handleRedirect = () => {
        if (statusCode === 404) {
            setIsRedirecting(true);
        } else {
            router.push(redirectPath);
        }
    };

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        } else {
            window.location.reload();
        }
    };

    // Format error message
    const errorMessage = error 
        ? (error instanceof Error ? error.message : String(error))
        : null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className={`w-full max-w-md p-8 rounded-lg shadow-lg ${bgColor} border ${borderColor}`}>
                <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full ${bgColor} mb-6`}>
                        <Icon className={`w-16 h-16 ${color}`} />
                    </div>

                    <h1 className="text-2xl font-bold mb-2">{title}</h1>
                    <p className="text-gray-600 mb-6">{description}</p>

                    {errorMessage && (
                        <div className="w-full p-4 bg-white rounded-md mb-6 overflow-x-auto">
                            <pre className="text-sm text-red-500 whitespace-pre-wrap">
                                {errorMessage}
                            </pre>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <Button
                            onClick={handleRedirect}
                            className="flex-1 flex items-center justify-center gap-2"
                        >
                            {statusCode === 404 && isRedirecting ? `Home (${countdown}s)` : 'Go to Home'}
                        </Button>

                        <Button
                            onClick={handleRetry}
                            className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                        >
                            <MdAutorenew className="w-5 h-5" />
                            Retry
                        </Button>
                    </div>
                </div>
            </div>

            {statusCode && (
                <div className="mt-8 text-gray-500 text-sm">
                    Error Code: {statusCode}
                </div>
            )}
        </div>
    );
}