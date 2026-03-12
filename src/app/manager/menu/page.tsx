"use client";

import { useEffect, useState } from "react";
import { canCrudMenu } from "@/features/manager/permissions";
import { managerApi, type Entity } from "@/shared/api/contracts/manager";

const BRANCH_ID = "b-1";

export default function ManagerMenuPage() {
  const allowed = canCrudMenu();
  const [menus, setMenus] = useState<Entity[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();

  useEffect(() => {
    const run = async () => {
      const response = await managerApi.getMenus(BRANCH_ID);
      setMenus(response.data.data.items);
    };
    void run();
  }, []);

  const create = async () => {
    if (!allowed) return;
    const trimmed = name.trim();
    if (trimmed.length < 3) {
      setError("Menu name min 3 chars");
      return;
    }

    setError(undefined);
    const optimistic = { id: `tmp-${Date.now()}`, name: trimmed };
    setMenus((prev) => [optimistic, ...prev]);
    setName("");

    try {
      const created = await managerApi.createMenu({ branchId: BRANCH_ID, name: trimmed });
      setMenus((prev) => prev.map((item) => (item.id === optimistic.id ? created.data.data : item)));
    } catch {
      setMenus((prev) => prev.filter((item) => item.id !== optimistic.id));
      setError("Create failed");
    }
  };

  const update = async (menu: Entity) => {
    if (!allowed) return;
    const nextName = window.prompt("New menu name", menu.name)?.trim();
    if (!nextName || nextName.length < 3) return;

    const snapshot = menu.name;
    setMenus((prev) => prev.map((item) => (item.id === menu.id ? { ...item, name: nextName } : item)));

    try {
      await managerApi.updateMenu(menu.id, { name: nextName });
    } catch {
      setMenus((prev) => prev.map((item) => (item.id === menu.id ? { ...item, name: snapshot } : item)));
      setError("Update failed");
    }
  };

  const remove = async (menu: Entity) => {
    if (!allowed) return;
    const snapshot = menus;
    setMenus((prev) => prev.filter((item) => item.id !== menu.id));

    try {
      await managerApi.deleteMenu(menu.id);
    } catch {
      setMenus(snapshot);
      setError("Delete failed");
    }
  };

  return (
    <section className="card">
      <h1>Menu CRUD</h1>
      <label>
        New Menu Name
        <input value={name} onChange={(event) => setName(event.target.value)} disabled={!allowed} />
      </label>
      <button type="button" disabled={!allowed} onClick={() => void create()}>
        Create Menu
      </button>
      {error ? <p>{error}</p> : null}

      <ul>
        {menus.map((menu) => (
          <li key={menu.id} style={{ marginBottom: 8 }}>
            {menu.name}
            <button type="button" onClick={() => void update(menu)} disabled={!allowed}>
              Edit
            </button>
            <button type="button" onClick={() => void remove(menu)} disabled={!allowed}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
