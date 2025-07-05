import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryModel.create(createCategoryDto as any);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.findAll({
      where: { deletedAt: null },
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryModel.findOne({
      where: { id, deletedAt: null },
    });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if (!category) {
      throw new Error('Category not found');
    }
    await category.update(updateCategoryDto);
    return category;
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    if (!category) {
      throw new Error('Category not found');
    }
    await category.update({ deletedAt: new Date() });
  }
} 