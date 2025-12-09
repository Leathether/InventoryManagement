"use client";

import Image from "next/image";
import { useState } from "react";
import type LoginInterface from "@/components/loginInterface";
import handleSubmit from "@/components/handleLoginSubmit";



export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const formData = { 
    email, setEmail, 
    password, setPassword,
    errors, setErrors, 
    loading, setLoading, 
    success, setSuccess,
    event: {} as React.FormEvent} as LoginInterface;


  


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-semibold">Sign in to Inventory Manager</h1>
        </div>

        <form
          onSubmit={(ev) => {
            console.log('Form submitted');
            ev.preventDefault();
            handleSubmit(formData as LoginInterface, ev);
          }}
          noValidate
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.email ? "border-red-400" : "border-gray-200"
              }`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.password ? "border-red-400" : "border-gray-200"
              }`}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {success && <p className="mt-4 text-sm text-green-700">{success}</p>}

      </div>
    </div>
  );
}
