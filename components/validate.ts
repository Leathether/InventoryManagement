import type LoginInterface from "@/components/loginInterface";

export default function validate(data: LoginInterface): boolean {
    const e: { email?: string; password?: string } = {};
    if (!data.email) e.email = "Email is required";
    else if (!/^[\w-.+]+@[\w-]+\.[\w-.]+$/.test(data.email)) e.email = "Enter a valid email";

    if (!data.password) e.password = "Password is required";
    else if (data.password.length < 6) e.password = "Password must be at least 6 characters";
    data.setErrors(e);
    return Object.keys(e).length === 0;
  }