"use client";

import { useEffect, useState } from "react";
import { canCrudMenu } from "@/features/manager/permissions";
import { managerApi, type Entity } from "@/shared/api/contracts/manager";

const MENU_ID = "m-1";

export default function CategoriesPage() {
  const allowed = canCrudMenu();
  const [categories, setCategories] = useState<Entity[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();

  useEffect(() => {
    const run = async () => {
      const response = await managerApi.getCategories(MENU_ID);
      setCategories(response.data.data.items);
    };
    void run();
  }, []);

  const create = async () => {
    if (!allowed) return;
    const trimmed = name.trim();
    if (trimmed.length < 3) {
      setError("Category name min 3 chars");
      return;
    }

    const optimistic = { id: `tmp-${Date.now()}`, name: trimmed };
    setCategories((prev) => [optimistic, ...prev]);
    setName("");
    setError(undefined);

    try {
      const created = await managerApi.createCategory({ menuId: MENU_ID, name: trimmed });
      setCategories((prev) => prev.map((item) => (item.id === optimistic.id ? created.data.data : item)));
    } catch {
      setCategories((prev) => prev.filter((item) => item.id !== optimistic.id));
      setError("Create failed");
    }
  };

  const update = async (category: Entity) => {
    if (!allowed) return;
    const nextName = window.prompt("New category name", category.name)?.trim();
    if (!nextName || nextName.length < 3) return;

    const snapshot = category.name;
    setCategories((prev) => prev.map((item) => (item.id === category.id ? { ...item, name: nextName } : item)));

    try {
      await managerApi.updateCategory(category.id, { name: nextName });
    } catch {
      setCategories((prev) => prev.map((item) => (item.id === category.id ? { ...item, name: snapshot } : item)));
      setError("Update failed");
    }
  };

  const remove = async (category: Entity) => {
    if (!allowed) return;
    const snapshot = categories;
    setCategories((prev) => prev.filter((item) => item.id !== category.id));

    try {
      await managerApi.deleteCategory(category.id);
    } catch {
      setCategories(snapshot);
      setError("Delete failed");
    }
  };

  return (
    <section className="card">
      <h1>Category CRUD</h1>
      <label>
        New Category Name
        <input value={name} onChange={(event) => setName(event.target.value)} disabled={!allowed} />
      </label>
      <button type="button" disabled={!allowed} onClick={() => void create()}>
        New Category
      </button>
      {error ? <p>{error}</p> : null}
      <ul>
        {categories.map((category) => (
          <li key={category.id} style={{ marginBottom: 8 }}>
            {category.name}
            <button type="button" onClick={() => void update(category)} disabled={!allowed}>
              Edit
            </button>
            <button type="button" onClick={() => void remove(category)} disabled={!allowed}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
