import { beforeEach, describe, expect, it } from "vitest";
import { useCustomerStore } from "./store";

describe("customer store", () => {
  beforeEach(() => {
    useCustomerStore.setState({ cart: [] });
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
});
