const Sequelize = require('sequelize');

const sequelize = new Sequelize('coupon-api',null,null,{
    dialect: 'sqlite',
    storage: './data/data.db'
});

const user = sequelize.define('User',{
    password: Sequelize.STRING,
    phoneNumber: Sequelize.STRING,
    userId:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    isVerified: Sequelize.BOOLEAN,
});

const vendor = sequelize.define('Vendor',{
    vendorId:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    vendorName: Sequelize.STRING
})

const product  = sequelize.define('Product',{
    productId:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    productName: Sequelize.STRING,
})

const deal = sequelize.define('deal',{
    dealId:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    hotDeal: Sequelize.BOOLEAN,
    discountPercent: Sequelize.INTEGER,
    buyOneGetOne: Sequelize.BOOLEAN
})

vendor.hasMany(product, {foreignKey: 'fk_vendorId', sourceKey: 'vendorId'});
product.belongsTo(vendor, {foreignKey: 'fk_vendorId', targetKey: 'vendorId'});

product.hasMany(deal, {foreignKey: 'fk_productId', sourceKey: 'productId'});
deal.belongsTo(product, {foreignKey: 'fk_productId', targetKey: 'productId'});

module.exports = {sequelize, user, product, deal, vendor};