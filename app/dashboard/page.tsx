"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  category: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<InventoryItem>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    quantity: 0,
    price: 0,
    category: "",
    description: "",
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/inventory", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "password_hash": localStorage.getItem("passwordHash") || "",
        },
      });
      const data = await res.json();

      if (data.success) {
        setInventory(data.data);
        setError(null);
      } else {
        setError(data.message || "Failed to fetch inventory");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = async (id: number) => {
    try {
      const res = await fetch("/api/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editForm }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchInventory();
        setEditingId(null);
        setEditForm({});
      } else {
        alert(data.message || "Failed to update item");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`/api/inventory?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        await fetchInventory();
      } else {
        alert(data.message || "Failed to delete item");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });

      const data = await res.json();
      if (data.success) {
        await fetchInventory();
        setShowAddForm(false);
        setAddForm({
          name: "",
          quantity: 0,
          price: 0,
          category: "",
          description: "",
        });
      } else {
        alert(data.message || "Failed to add item");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("passwordHash");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Inventory Manager</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              {showAddForm ? "Cancel" : "Add Item"}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={addForm.quantity}
                onChange={(e) =>
                  setAddForm({ ...addForm, quantity: parseInt(e.target.value) || 0 })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={addForm.price}
                onChange={(e) =>
                  setAddForm({ ...addForm, price: parseFloat(e.target.value) || 0 })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Category"
                value={addForm.category}
                onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={addForm.description}
                onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2 md:col-span-2"
              />
            </div>
            <button
              onClick={handleAdd}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Add Item
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No inventory items found. Add your first item to get started.
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{item.id}</td>
                      <td className="px-4 py-3 text-sm">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editForm.name || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        ) : (
                          item.name
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {editingId === item.id ? (
                          <input
                            type="number"
                            value={editForm.quantity || 0}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                quantity: parseInt(e.target.value) || 0,
                              })
                            }
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        ) : (
                          item.quantity
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {editingId === item.id ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.price || 0}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                price: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        ) : (
                          `$${Number(item.price).toFixed(2)}`
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editForm.category || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, category: e.target.value })
                            }
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        ) : (
                          item.category
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editForm.description || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, description: e.target.value })
                            }
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        ) : (
                          item.description
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {editingId === item.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(item.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditForm({});
                              }}
                              className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
