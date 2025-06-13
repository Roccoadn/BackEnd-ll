import userModel from "../models/users.model.js";

export class UserRepository {
  async getAll() {
    return await userModel.find().lean();
  }

  async getById(id) {
    return await userModel.findById(id).lean();
  }

  async getByEmail(email) {
    return await userModel.findOne({ email }).lean();
  }

  async create(userData) {
    return await userModel.create(userData);
  }

  async update(id, updateData) {
    return await userModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await userModel.findByIdAndDelete(id);
  }

  async updatePassword(id, hashedPassword) {
    return await userModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
  }
}