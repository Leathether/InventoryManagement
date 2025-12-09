# Inventory Manager - Database Setup

## Database Configuration

This application uses MySQL for user authentication and inventory management.

### Setup Steps

1. **Install MySQL** (if not already installed)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mysql-server
   
   # macOS
   brew install mysql
   ```

2. **Start MySQL and create the database**
   ```bash
   # Start MySQL
   sudo mysql -u root -p
   
   # Create database
   CREATE DATABASE inventory_manager;
   EXIT;
   ```

3. **Run the setup SQL script**
   ```bash
   mysql -u root -p inventory_manager < setup-db.sql
   ```

4. **Configure environment variables**
   - Copy `.env.example` to `.env.local`
   - Update `DATABASE_URL` with your actual database credentials
   - Example: `mysql://root:yourpassword@localhost:3306/inventory_manager`

5. **Create a user account**
   ```bash
   # Generate a password hash
   node scripts/hash-password.js your_password
   
   # Use the generated hash in your SQL command
   mysql -u root -p inventory_manager
   INSERT INTO users (email, password_hash) VALUES ('your@email.com', 'generated_hash');
   ```

### Test User
- **Email:** `user@example.com`
- **Password:** `password123`

## Database Schema

### Users Table
```sql
- id: SERIAL PRIMARY KEY
- email: VARCHAR(255) UNIQUE NOT NULL
- password_hash: VARCHAR(255) NOT NULL
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Security Notes

- Passwords are hashed using bcrypt with 10 salt rounds
- Never store plain text passwords
- Use environment variables for database credentials
- The `.env.local` file is gitignored by default
