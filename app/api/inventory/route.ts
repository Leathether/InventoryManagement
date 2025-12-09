import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Fetch all inventory items from the database
    const headersList = await headers();

    if (!headersList.get('password_hash')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Password hash is required' 
      }, { status: 400 });
    } else {``
      const isValid = await query(
        'SELECT * FROM users WHERE password_hash = ?',
        [headersList.get('password_hash')]
      );
      
      if (!Array.isArray(isValid.rows) || isValid.rows.length === 0) {
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid password hash' 
        }, { status: 401 });
      }
    } 

    const result = await query(
      'SELECT id, name, quantity, price, category, description, created_at, updated_at FROM inventory ORDER BY id ASC'
    );

    return NextResponse.json({ 
      success: true, 
      data: result.rows 
    }, { status: 200 });

  } catch (err) {
    console.error('Error fetching inventory:', err);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch inventory data' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, quantity, price, category, description } = body;

    if (!name || quantity === undefined || price === undefined) {
      return NextResponse.json({ 
        success: false, 
        message: 'Name, quantity, and price are required' 
      }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO inventory (name, quantity, price, category, description) VALUES (?, ?, ?, ?, ?)',
      [name, quantity, price, category || '', description || '']
    );

    // Fetch the inserted item
    const insertedItem = await query(
      'SELECT * FROM inventory WHERE id = LAST_INSERT_ID()'
    );

    return NextResponse.json({ 
      success: true, 
      data: Array.isArray(insertedItem.rows) ? insertedItem.rows[0] : insertedItem.rows 
    }, { status: 201 });

  } catch (err) {
    console.error('Error creating inventory item:', err);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create inventory item' 
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, quantity, price, category, description } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID is required' 
      }, { status: 400 });
    }

    await query(
      'UPDATE inventory SET name = ?, quantity = ?, price = ?, category = ?, description = ? WHERE id = ?',
      [name, quantity, price, category, description, id]
    );

    // Fetch the updated item
    const updatedItem = await query(
      'SELECT * FROM inventory WHERE id = ?',
      [id]
    );

    if (!Array.isArray(updatedItem.rows) || updatedItem.rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Item not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedItem.rows[0] 
    }, { status: 200 });

  } catch (err) {
    console.error('Error updating inventory item:', err);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update inventory item' 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID is required' 
      }, { status: 400 });
    }

    // Check if item exists
    const existing = await query(
      'SELECT id FROM inventory WHERE id = ?',
      [id]
    );

    if (!Array.isArray(existing.rows) || existing.rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Item not found' 
      }, { status: 404 });
    }

    // Delete the item
    await query(
      'DELETE FROM inventory WHERE id = ?',
      [id]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Item deleted successfully' 
    }, { status: 200 });

  } catch (err) {
    console.error('Error deleting inventory item:', err);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete inventory item' 
    }, { status: 500 });
  }
}
