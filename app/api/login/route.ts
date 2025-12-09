import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt, { compare } from 'bcrypt';
import storePassword from '@/scripts/storePassword';
import comparePasswords from '@/scripts/comparePassword';
import genSalt from '@/scripts/genSalt';

export async function POST(request: Request) {
  
  try {
    try {
    const salt = genSalt(); 
    await storePassword('bob@gmail.com', 'testpassword');
  } catch (err) {
    console.error('Error storing password during login route POST:', err);
  }
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    // Compare the provided password with the stored hash
    const passwordMatch: [boolean, string] = await comparePasswords(password, email);

    if (!passwordMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Authentication successful
    return NextResponse.json({ 
      success: true, message: 'Login successful', passwordHash: passwordMatch[1],
    }, { status: 200 });

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
