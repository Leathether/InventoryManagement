"use client"

import type { Dispatch, SetStateAction, FormEvent } from "react";

export default interface LoginInterface {
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
    password: string;
    setPassword: Dispatch<SetStateAction<string>>;
    errors: { email?: string; password?: string };
    setErrors: Dispatch<SetStateAction<{ email?: string; password?: string }>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    success: string | null;
    setSuccess: Dispatch<SetStateAction<string | null>>;
    event?: FormEvent;
}