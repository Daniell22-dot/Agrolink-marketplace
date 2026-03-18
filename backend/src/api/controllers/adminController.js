const User = require('../../models/User');
const Product = require('../../models/Product');
const Order = require('../../models/Order');

// @desc    Get system stats
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userCount = await User.count();
    const productCount = await Product.count();
    const orderCount = await Order.count();
    
    const totalRevenue = await Order.sum('totalAmount', { where: { paymentStatus: 'completed' } }) || 0;

    res.json({
      success: true,
      data: {
        totalUsers: userCount,
        totalProducts: productCount,
        totalOrders: orderCount,
        totalRevenue: totalRevenue,
        newOrdersToday: 0,
        pendingOrders: await Order.count({ where: { status: 'pending' } })
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent activity
// @route   GET /api/admin/dashboard/activity
// @access  Private/Admin
exports.getRecentActivity = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['fullName'] }]
    });

    const activity = orders.map(o => ({
      id: o.id,
      type: 'order',
      description: `New order from ${o.User?.fullName || 'User'}`,
      timestamp: o.createdAt
    }));

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    console.log('--- FETCHING ALL USERS ---');
    console.log('Query params:', req.query);

    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    console.log('Found users count:', count);

    res.json({
      success: true,
      count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    next(error);
  }
};

// @desc    Update user (status or verification)
// @route   PUT /api/admin/users/:id/update
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        const { status, isVerified } = req.body;
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (status !== undefined) user.status = status;
        if (isVerified !== undefined) user.isVerified = isVerified;
        
        await user.save();

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send notification to user
// @route   POST /api/admin/users/:id/notify
// @access  Private/Admin
exports.sendNotificationToUser = async (req, res, next) => {
    try {
        const { title, message } = req.body;
        res.json({
            success: true,
            message: 'Notification sent successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (Admin)
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [{ model: User, as: 'Farmer', attributes: ['fullName', 'email'] }]
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Product Status
// @route   PUT /api/admin/products/:id/:action
// @access  Private/Admin
exports.updateProductStatus = async (req, res, next) => {
  try {
    const { id, action } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if (action === 'approve') product.isAvailable = true;
    if (action === 'reject' || action === 'suspend') product.isAvailable = false;
    
    await product.save();

    res.json({
        success: true,
        data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            include: [{ 
                model: User, 
                attributes: ['fullName', 'email', 'phone', 'location', 'latitude', 'longitude', 'county', 'subCounty'] 
            }]
        });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get order detail
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
exports.getOrderDetail = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['fullName', 'email', 'phone'] }]
        });
        res.json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

// @desc    Get chart data for admin dashboard
// @route   GET /api/admin/dashboard/chart/:type
// @access  Private/Admin
exports.getChartData = async (req, res, next) => {
  try {
    const { type } = req.params;
    let data = [];
    
    if (type === 'users') {
      const buyerCount = await User.count({ where: { role: 'buyer' } });
      const farmerCount = await User.count({ where: { role: 'farmer' } });
      const adminCount = await User.count({ where: { role: 'admin' } });
      data = [
        { name: 'Buyers', value: buyerCount, color: '#3B82F6' },
        { name: 'Farmers', value: farmerCount, color: '#10B981' },
        { name: 'Admins', value: adminCount, color: '#8B5CF6' }
      ];
    } else if (type === 'sales') {
        const orders = await Order.findAll();
        const totalRev = orders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0);
        data = [
            { name: 'Week 1', sales: orders.length, revenue: totalRev, orders: orders.length }
        ];
    } else if (type === 'products') {
        const products = await Product.findAll();
        const categories = {};
        products.forEach(p => {
             const cat = p.category || 'Other';
             categories[cat] = (categories[cat] || 0) + 1;
        });
        Object.keys(categories).forEach(cat => {
            data.push({ name: cat, count: categories[cat] });
        });
        if (data.length === 0) {
            data = [{ name: 'No Products', count: 0 }];
        }
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};
