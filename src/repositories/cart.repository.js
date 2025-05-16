import cartModel from "../models/carts.model.js";

export class CartRepository {
  async getAll() {
    return await cartModel.find().lean();
  }

  async getById(id) {
    return await cartModel.findById(id).populate('products.product').lean();
  }

  async create(cartData = {}) {
    return await cartModel.create(cartData);
  }

  async update(cartId, updateData) {
    return await cartModel.findByIdAndUpdate(cartId, updateData, { new: true });
  }

  async delete(cartId) {
    return await cartModel.findByIdAndDelete(cartId);
  }

  async addProduct(cartId, productId, quantity = 1) {
    const cart = await cartModel.findById(cartId);
    if (!cart) return null;

    const existingProduct = cart.products.find(p => p.product.equals(productId));
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    return await cart.save();
  }

  async removeProduct(cartId, productId) {
    const cart = await cartModel.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter(p => !p.product.equals(productId));
    return await cart.save();
  }

  async clearCart(cartId) {
    return await cartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
  }

  async updateQuantity(cartId, productId, action = 'decrease') {
  const cart = await cartModel.findById(cartId);
  if (!cart) return null;

  const item = cart.products.find(p => p.product.equals(productId));
  if (!item) return null;

  if (action === 'decrease') {
    item.quantity = Math.max(item.quantity - 1, 0);
    if (item.quantity === 0) {
      // opcional: quitar el producto si llega a 0
      cart.products = cart.products.filter(p => !p.product.equals(productId));
    }
  } else if (action === 'increase') {
    item.quantity += 1;
  }

  return await cart.save();
  }
}