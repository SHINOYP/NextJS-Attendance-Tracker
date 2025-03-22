// context/AlertContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "default" | "success" | "error" | "warning" | "info";

interface AlertProps {
    title?: string;
    message: string;
    type?: AlertType;
    duration?: number;
}

interface AlertContextProps {
    showAlert: (props: AlertProps) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};

interface AlertProviderProps {
    children: ReactNode;
}

export const AlertProvider = ({ children }: AlertProviderProps) => {
    const [alerts, setAlerts] = useState<(AlertProps & { id: string })[]>([]);

    const showAlert = useCallback(({ title, message, type = "default", duration = 5000 }: AlertProps) => {
        const id = Math.random().toString(36).substring(2, 9);
        setAlerts((prev) => [...prev, { id, title, message, type, duration }]);

        setTimeout(() => {
            setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        }, duration);
    }, []);

    const dismissAlert = useCallback((id: string) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, []);

    const getAlertStyle = (type: AlertType) => {
        switch (type) {
            case "success":
                return "border-green-500 bg-green-50 text-green-800";
            case "error":
                return "border-red-500 bg-red-50 text-red-800";
            case "warning":
                return "border-yellow-500 bg-yellow-50 text-yellow-800";
            case "info":
                return "border-blue-500 bg-blue-50 text-blue-800";
            default:
                return "border-gray-200 bg-gray-50 text-gray-800";
        }
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}

            {alerts.length > 0 && (
                <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-lg">
                    {alerts.map((alert) => (
                        <Alert
                            key={alert.id}
                            className={cn("w-full shadow-md relative pr-8", getAlertStyle(alert.type || "default"))}
                        >
                            <button
                                onClick={() => dismissAlert(alert.id)}
                                className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-200/50"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
                            <AlertDescription>{alert.message}</AlertDescription>
                        </Alert>
                    ))}
                </div>
            )}
        </AlertContext.Provider>
    );
};