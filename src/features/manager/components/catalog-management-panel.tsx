"use client";

import { useEffect, useState } from "react";
import { canCrudMenu } from "@/features/manager/permissions";
import { managerApi, type Entity } from "@/shared/api/contracts/manager";

type Level = "menu" | "category" | "product";

const MIN_NAME_LENGTH = 3;

export function CatalogManagementPanel({ initialFocus = "menu" }: { initialFocus?: Level }) {
  const allowed = canCrudMenu();

  const [branches, setBranches] = useState<Entity[]>([]);
  const [menus, setMenus] = useState<Entity[]>([]);
  const [categories, setCategories] = useState<Entity[]>([]);
  const [products, setProducts] = useState<Entity[]>([]);

  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [menuName, setMenuName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [productName, setProductName] = useState("");

  const [error, setError] = useState<string>();

  useEffect(() => {
    const loadBranches = async () => {
      const response = await managerApi.getBranches();
      const items = response.data.data.items;
      setBranches(items);
      if (items[0]) setSelectedBranchId(items[0].id);
    };

    void loadBranches();
  }, []);

  useEffect(() => {
    const loadMenus = async () => {
      if (!selectedBranchId) {
        setMenus([]);
        setSelectedMenuId("");
        return;
      }

      const response = await managerApi.getMenus(selectedBranchId);
      const items = response.data.data.items;
      setMenus(items);
      setSelectedMenuId((prev) => (items.some((item) => item.id === prev) ? prev : (items[0]?.id ?? "")));
    };

    setCategories([]);
    setProducts([]);
    setSelectedCategoryId("");
    void loadMenus();
  }, [selectedBranchId]);

  useEffect(() => {
    const loadCategories = async () => {
      if (!selectedMenuId) {
        setCategories([]);
        setSelectedCategoryId("");
        return;
      }

      const response = await managerApi.getCategories(selectedMenuId);
      const items = response.data.data.items;
      setCategories(items);
      setSelectedCategoryId((prev) => (items.some((item) => item.id === prev) ? prev : (items[0]?.id ?? "")));
    };

    setProducts([]);
    void loadCategories();
  }, [selectedMenuId]);

  useEffect(() => {
    const loadProducts = async () => {
      if (!selectedCategoryId) {
        setProducts([]);
        return;
      }

      const response = await managerApi.getProducts(selectedCategoryId);
      setProducts(response.data.data.items);
    };

    void loadProducts();
  }, [selectedCategoryId]);

  const validateName = (name: string, type: string) => {
    if (name.trim().length < MIN_NAME_LENGTH) {
      setError(`${type} name min ${MIN_NAME_LENGTH} chars`);
      return false;
    }

    setError(undefined);
    return true;
  };

  const createMenu = async () => {
    if (!allowed || !selectedBranchId || !validateName(menuName, "Menu")) return;

    const response = await managerApi.createMenu({ branchId: selectedBranchId, name: menuName.trim() });
    const created = response.data.data;
    setMenus((prev) => [created, ...prev]);
    setSelectedMenuId(created.id);
    setMenuName("");
  };

  const createCategory = async () => {
    if (!allowed || !selectedMenuId || !validateName(categoryName, "Category")) return;

    const response = await managerApi.createCategory({ menuId: selectedMenuId, name: categoryName.trim() });
    const created = response.data.data;
    setCategories((prev) => [created, ...prev]);
    setSelectedCategoryId(created.id);
    setCategoryName("");
  };

  const createProduct = async () => {
    if (!allowed || !selectedCategoryId || !validateName(productName, "Product")) return;

    const response = await managerApi.createProduct({ categoryId: selectedCategoryId, name: productName.trim() });
    const created = response.data.data;
    setProducts((prev) => [created, ...prev]);
    setProductName("");
  };

  const renameEntity = async (entity: Entity, level: Level) => {
    if (!allowed) return;

    const nextName = window.prompt("Yeni isim", entity.name)?.trim();
    if (!nextName || nextName.length < MIN_NAME_LENGTH) return;

    if (level === "menu") {
      await managerApi.updateMenu(entity.id, { name: nextName });
      setMenus((prev) => prev.map((item) => (item.id === entity.id ? { ...item, name: nextName } : item)));
      return;
    }

    if (level === "category") {
      await managerApi.updateCategory(entity.id, { name: nextName });
      setCategories((prev) => prev.map((item) => (item.id === entity.id ? { ...item, name: nextName } : item)));
      return;
    }

    await managerApi.updateProduct(entity.id, { name: nextName });
    setProducts((prev) => prev.map((item) => (item.id === entity.id ? { ...item, name: nextName } : item)));
  };

  const deleteEntity = async (entity: Entity, level: Level) => {
    if (!allowed) return;

    if (level === "menu") {
      await managerApi.deleteMenu(entity.id);
      setMenus((prev) => prev.filter((item) => item.id !== entity.id));
      if (selectedMenuId === entity.id) setSelectedMenuId("");
      return;
    }

    if (level === "category") {
      await managerApi.deleteCategory(entity.id);
      setCategories((prev) => prev.filter((item) => item.id !== entity.id));
      if (selectedCategoryId === entity.id) setSelectedCategoryId("");
      return;
    }

    await managerApi.deleteProduct(entity.id);
    setProducts((prev) => prev.filter((item) => item.id !== entity.id));
  };

  return (
    <section className="card">
      <h1>Menü / Kategori / Ürün Yönetimi</h1>
      <p>Bağımlı akış: Önce şube ve menü, sonra kategori, en son ürün yönetilir.</p>

      <label htmlFor="branch-select">Şube</label>
      <select id="branch-select" value={selectedBranchId} onChange={(event) => setSelectedBranchId(event.target.value)}>
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>

      {error ? <p>{error}</p> : null}

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        <EntityColumn
          title="Menüler"
          selectedId={selectedMenuId}
          onSelect={setSelectedMenuId}
          entities={menus}
          inputValue={menuName}
          onInputChange={setMenuName}
          addLabel="Menü ekle"
          onCreate={() => void createMenu()}
          onRename={(entity) => void renameEntity(entity, "menu")}
          onDelete={(entity) => void deleteEntity(entity, "menu")}
          disabled={!allowed || !selectedBranchId}
          highlighted={initialFocus === "menu"}
        />

        <EntityColumn
          title="Kategoriler"
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
          entities={categories}
          inputValue={categoryName}
          onInputChange={setCategoryName}
          addLabel="Kategori ekle"
          onCreate={() => void createCategory()}
          onRename={(entity) => void renameEntity(entity, "category")}
          onDelete={(entity) => void deleteEntity(entity, "category")}
          disabled={!allowed || !selectedMenuId}
          highlighted={initialFocus === "category"}
        />

        <EntityColumn
          title="Ürünler"
          selectedId=""
          onSelect={() => undefined}
          entities={products}
          inputValue={productName}
          onInputChange={setProductName}
          addLabel="Ürün ekle"
          onCreate={() => void createProduct()}
          onRename={(entity) => void renameEntity(entity, "product")}
          onDelete={(entity) => void deleteEntity(entity, "product")}
          disabled={!allowed || !selectedCategoryId}
          highlighted={initialFocus === "product"}
          showSelection={false}
        />
      </div>
    </section>
  );
}

type ColumnProps = {
  title: string;
  selectedId: string;
  onSelect: (id: string) => void;
  entities: Entity[];
  inputValue: string;
  onInputChange: (value: string) => void;
  addLabel: string;
  onCreate: () => void;
  onRename: (entity: Entity) => void;
  onDelete: (entity: Entity) => void;
  disabled: boolean;
  highlighted: boolean;
  showSelection?: boolean;
};

function EntityColumn({
  title,
  selectedId,
  onSelect,
  entities,
  inputValue,
  onInputChange,
  addLabel,
  onCreate,
  onRename,
  onDelete,
  disabled,
  highlighted,
  showSelection = true,
}: ColumnProps) {
  return (
    <div style={{ border: highlighted ? "2px solid #4f46e5" : "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <input value={inputValue} disabled={disabled} onChange={(event) => onInputChange(event.target.value)} placeholder={`${title} adı`} />
      <button type="button" onClick={onCreate} disabled={disabled}>
        {addLabel}
      </button>

      {showSelection ? (
        <label>
          Seçili
          <select value={selectedId} onChange={(event) => onSelect(event.target.value)} disabled={entities.length === 0}>
            <option value="">Seçiniz</option>
            {entities.map((entity) => (
              <option key={entity.id} value={entity.id}>
                {entity.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <ul>
        {entities.map((entity) => (
          <li key={entity.id} style={{ marginBottom: 8 }}>
            {entity.name}
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => onRename(entity)} disabled={disabled}>
                Düzenle
              </button>
              <button type="button" onClick={() => onDelete(entity)} disabled={disabled}>
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
