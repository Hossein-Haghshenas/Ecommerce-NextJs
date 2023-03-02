import { create } from "zustand";
import { getAllProducts, getCategories } from "../api/products";

export const useProductsStore = create((set) => ({
  products: [],
  categories: [],
  getProducts: async () => {
    const res = getAllProducts();
    res.then((res) => set({ products: res }));
  },
  getCategories: async () => {
    const res = getCategories();
    res.then((res) => set({ categories: res }));
  },
}));

useProductsStore.getState().getProducts();
useProductsStore.getState().getCategories();

export const useFavoritesStore = create((set) => ({
  favorites: [],
  setFavorites: function (title, id) {
    set((state) => {
      if (!this.favorites.includes(title)) {
        return {
          favorites: [...state.favorites, title],
        };
      } else {
        return {
          favorites: [...state.favorites.filter((item) => item !== title)],
        };
      }
    });
  },
}));

export const useCartStore = create((set) => ({
  cart: [],
  openCart: false,
  cartTotalCount: 0,
  cartTotalAmount: 0,
  setOpenCart: () =>
    set((state) => ({
      openCart: !state.openCart,
    })),
  setCartProducts: (product) => {
    const products = useCartStore.getState((state) => state).cart;
    const itemIndex = products.findIndex((item) => item.id === product.id);

    if (itemIndex < 0) {
      const temp = { ...product, productCount: 1 };
      set((state) => ({ cart: [...state.cart, temp] }));
    } else {
      products[itemIndex].productCount += 1;
    }
    useCartStore.getState((state) => state).setGetTotals();
  },
  setCartProductsCount: (id, plus) => {
    const products = useCartStore.getState((state) => state).cart;
    const itemIndex = products.findIndex((item) => item.id === id);

    if (plus) {
      products[itemIndex].productCount += 1;
    } else {
      if (products[itemIndex].productCount === 1) {
        useCartStore.getState((state) => state).removeCartProducts(id);
      } else {
        products[itemIndex].productCount -= 1;
      }
    }
    useCartStore.getState((state) => state).setGetTotals();
  },
  removeCartProducts: (id) => {
    set((state) => ({ cart: [...state.cart.filter((item) => item.id !== id)] }));
    useCartStore.getState((state) => state).setGetTotals();
  },
  removeAllCartProducts: () => set({ cart: [] }),
  setGetTotals: function () {
    const products = useCartStore.getState((state) => state).cart;

    const amounts =
      products.length !== 0 ? products.map((product) => product.price.replace(",", ".") * product.productCount).reduce((a, b) => a + b) : 0;
    const counts = products.length !== 0 ? products.map((product) => product.productCount).reduce((a, b) => a + b) : 0;

    set({ cartTotalCount: counts, cartTotalAmount: amounts });
  },
}));
