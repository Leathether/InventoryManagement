import type LoginInterface from "./loginInterface";
import validate from "./validate";

export default async function handleSubmit(data: LoginInterface, ev?: React.FormEvent): Promise<void> {
    try {
        console.log('Handling login submit');
        ev?.preventDefault();
        data.setLoading(true);
        data.setSuccess(null);

        if (!validate(data)) {
            data.setLoading(false);
            return;
        }

        const res = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.email, password: data.password }),
        });

        if (!res.ok) {
            const text = await res.text();
            data.setErrors({ email: text || 'Login failed' });
            data.setSuccess(null);
        } else {
            console.log('Login response received');
            const json = await res.json();
            if (json.success) {
                data.setSuccess('Login successful!');
                data.setErrors({});
                localStorage.setItem('passwordHash', json.passwordHash || '');
                // Redirect to dashboard after successful login
                window.location.href = '/dashboard';
            } else {
                data.setErrors({ email: json.message || 'Invalid email or password' });
                data.setSuccess(null);
            }
        }
    } catch (err) {
        data.setErrors({ email: 'Network error' });
        data.setSuccess(null);
    } finally {
        data.setLoading(false);
    }
}