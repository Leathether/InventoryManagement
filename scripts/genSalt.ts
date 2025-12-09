import bcrypt from 'bcrypt';

export default function genSalt(): string {   
    const saltRounds = 10;
    return bcrypt.genSaltSync(saltRounds);
}