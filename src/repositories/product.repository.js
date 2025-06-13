import productsModel from '../models/products.model.js';

export class ProductRepository {
  async getAll(filter = {}, options = {}) {
    if (productsModel.paginate) {
      return await productsModel.paginate(filter, options);
    }
    return await productsModel.find(filter).lean();
  }

  async getById(id) {
    return await productsModel.findById(id).lean();
  }

  async create(data) {
    return await productsModel.create(data);
  }

  async update(id, data) {
    return await productsModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await productsModel.findByIdAndDelete(id);
  }

  async paginate(filter = {}, options = {}) {
    return await productsModel.paginate(filter, options);
  }
}