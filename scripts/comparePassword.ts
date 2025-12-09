import hashPassword from "./hashPassword";
import { query } from "../lib/db";

export default async function comparePasswords(password: string, userName: string): Promise<[boolean, string]> {
    try {
        const result = await query('SELECT password_hash, salt FROM users WHERE email = ?', [userName]);
        const rows = result.rows as any[];
        if (rows.length === 0) {
            console.error('User not found');
            return [false, ''];
        }
        const { password_hash, salt } = rows[0];
        const hashedInputPassword = hashPassword(password, salt);
        if (hashedInputPassword === password_hash) {
            console.log('Password match');
            return ([true, password_hash]);
        } else {
            console.log('Password does not match');
            return ([false, password_hash]);
        }
    } catch(err) {
        console.error('Error querying database:', err);
        return [false, ''];
    }
}