"use client";

import { useEffect, useState } from "react";
import { canCrudMenu } from "@/features/manager/permissions";
import { managerApi, type Entity } from "@/shared/api/contracts/manager";

const CATEGORY_ID = "c-1";

export default function ProductsPage() {
  const allowed = canCrudMenu();
  const [products, setProducts] = useState<Entity[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();

  useEffect(() => {
    const run = async () => {
      const response = await managerApi.getProducts(CATEGORY_ID);
      setProducts(response.data.data.items);
    };
    void run();
  }, []);

  const create = async () => {
    if (!allowed) return;
    const trimmed = name.trim();
    if (trimmed.length < 3) {
      setError("Product name min 3 chars");
      return;
    }

    const optimistic = { id: `tmp-${Date.now()}`, name: trimmed };
    setProducts((prev) => [optimistic, ...prev]);
    setName("");
    setError(undefined);

    try {
      const created = await managerApi.createProduct({ categoryId: CATEGORY_ID, name: trimmed });
      setProducts((prev) => prev.map((item) => (item.id === optimistic.id ? created.data.data : item)));
    } catch {
      setProducts((prev) => prev.filter((item) => item.id !== optimistic.id));
      setError("Create failed");
    }
  };

  const update = async (product: Entity) => {
    if (!allowed) return;
    const nextName = window.prompt("New product name", product.name)?.trim();
    if (!nextName || nextName.length < 3) return;

    const snapshot = product.name;
    setProducts((prev) => prev.map((item) => (item.id === product.id ? { ...item, name: nextName } : item)));

    try {
      await managerApi.updateProduct(product.id, { name: nextName });
    } catch {
      setProducts((prev) => prev.map((item) => (item.id === product.id ? { ...item, name: snapshot } : item)));
      setError("Update failed");
    }
  };

  const remove = async (product: Entity) => {
    if (!allowed) return;
    const snapshot = products;
    setProducts((prev) => prev.filter((item) => item.id !== product.id));

    try {
      await managerApi.deleteProduct(product.id);
    } catch {
      setProducts(snapshot);
      setError("Delete failed");
    }
  };

  return (
    <section className="card">
      <h1>Product CRUD</h1>
      <label>
        New Product Name
        <input value={name} onChange={(event) => setName(event.target.value)} disabled={!allowed} />
      </label>
      <button type="button" disabled={!allowed} onClick={() => void create()}>
        New Product
      </button>
      {error ? <p>{error}</p> : null}
      <ul>
        {products.map((product) => (
          <li key={product.id} style={{ marginBottom: 8 }}>
            {product.name}
            <button type="button" onClick={() => void update(product)} disabled={!allowed}>
              Edit
            </button>
            <button type="button" onClick={() => void remove(product)} disabled={!allowed}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
