import Category from '../models/Category.js';

/**
 * Get all categories
 * GET /api/categories
 * Access: Admin, Cashier
 */
export const getCategories = async (req, res) => {
    try {
        const { isActive } = req.query;
        const query = {};
        
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const categories = await Category.find(query)
            .populate('parent', 'name')
            .sort({ sortOrder: 1, name: 1 });

        res.json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch categories' });
    }
};

/**
 * Get single category
 * GET /api/categories/:id
 * Access: Admin, Cashier
 */
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('parent', 'name');

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch category' });
    }
};

/**
 * Create new category
 * POST /api/categories
 * Access: Admin only
 */
export const createCategory = async (req, res) => {
    try {
        const { name, description, parent, sortOrder } = req.body;

        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category with this name already exists' });
        }

        const category = new Category({
            name,
            description,
            parent: parent || null,
            sortOrder: sortOrder || 0
        });

        await category.save();

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Failed to create category' });
    }
};

/**
 * Update category
 * PUT /api/categories/:id
 * Access: Admin only
 */
export const updateCategory = async (req, res) => {
    try {
        const { name, description, parent, sortOrder, isActive } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if new name conflicts with existing category
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({ message: 'Category with this name already exists' });
            }
            category.name = name;
        }

        if (description !== undefined) category.description = description;
        if (parent !== undefined) category.parent = parent || null;
        if (sortOrder !== undefined) category.sortOrder = sortOrder;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();

        res.json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Failed to update category' });
    }
};

/**
 * Delete category
 * DELETE /api/categories/:id
 * Access: Admin only
 */
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if category has products
        const Product = (await import('../models/Product.js')).default;
        const productsCount = await Product.countDocuments({ category: category._id });

        if (productsCount > 0) {
            return res.status(400).json({ 
                message: `Cannot delete category. It has ${productsCount} products. Please reassign or delete products first.` 
            });
        }

        // Check if category has child categories
        const childCategories = await Category.countDocuments({ parent: category._id });

        if (childCategories > 0) {
            return res.status(400).json({ 
                message: `Cannot delete category. It has ${childCategories} subcategories. Please delete subcategories first.` 
            });
        }

        await category.deleteOne();

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to delete category' });
    }
};
