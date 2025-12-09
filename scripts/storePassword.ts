import hashPassword from './hashPassword';
import  {query}  from "../lib/db";
import genSalt from './genSalt';


export default async function storePassword(userName: string, password: string): Promise<void> {
    const salt = genSalt();
    const hashedPassword = hashPassword(password, salt);
    await query('DELETE FROM users WHERE email = ?', [userName])
    // Store the hashed password in the database
    await query('INSERT INTO users (email, password_hash, salt) VALUES (?, ?, ?)', [userName, hashedPassword, salt])
        .then(() => {
            console.log('Password stored successfully');
            })
    .catch((err) => {
        console.error('Error storing password:', err);
    });
}


