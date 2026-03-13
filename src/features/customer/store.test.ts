import { beforeEach, describe, expect, it } from "vitest";
import { useCustomerStore } from "./store";

describe("customer store", () => {
  beforeEach(() => {
    useCustomerStore.setState({
      cart: [],
      tableId: "T-12",
      activeTableOrder: undefined,
      recentlyPlacedOrder: undefined,
    });
  });

  it("adds product into cart", () => {
    const product = useCustomerStore.getState().restaurants[0].products[0];
    useCustomerStore.getState().addToCart(product);
    expect(useCustomerStore.getState().cart).toHaveLength(1);
    expect(useCustomerStore.getState().cart[0].qty).toBe(1);
  });

  it("removes product from cart", () => {
    const product = useCustomerStore.getState().restaurants[0].products[0];
    useCustomerStore.getState().addToCart(product);
    useCustomerStore.getState().removeFromCart(product.id);
    expect(useCustomerStore.getState().cart).toHaveLength(0);
  });

  it("saves item order note", () => {
    const product = useCustomerStore.getState().restaurants[0].products[0];
    useCustomerStore.getState().addToCart(product);
    useCustomerStore.getState().setOrderNote(product.id, "soğansız");

    expect(useCustomerStore.getState().cart[0].note).toBe("soğansız");
  });

  it("normalizes table context", () => {
    useCustomerStore.getState().setTableId(" t-9 ");
    expect(useCustomerStore.getState().tableId).toBe("T-9");
  });

  it("creates then merges order for same table", () => {
    const [kebap, ayran] = useCustomerStore.getState().restaurants[0].products;

    useCustomerStore.getState().addToCart(kebap);
    const created = useCustomerStore.getState().placeOrMergeOrder();

    expect(created?.merged).toBe(false);
    expect(useCustomerStore.getState().activeTableOrder?.items[0].qty).toBe(1);

    useCustomerStore.getState().addToCart(ayran);
    const merged = useCustomerStore.getState().placeOrMergeOrder();

    expect(merged?.merged).toBe(true);
    expect(useCustomerStore.getState().activeTableOrder?.items).toHaveLength(2);
    expect(useCustomerStore.getState().activeTableOrder?.mergedCount).toBe(1);
    expect(useCustomerStore.getState().cart).toHaveLength(0);
  });
});
