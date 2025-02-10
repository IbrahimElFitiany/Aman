const { DataTypes } = require('sequelize');

const HouseModel = (sequelize) => {
    const House = sequelize.define('house', {
        house_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Assuming your users table is named 'users'
                key: 'user_id',
            },
            onDelete: 'CASCADE', // Ensures houses are deleted if the user is deleted
            unique: true, // One house per user
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        government:{
            type: DataTypes.STRING(255),
            allowNull: false, 
        },
        city:{
            type: DataTypes.STRING(255),
            allowNull: false, 
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
        }
    }, {
        tableName: 'houses',
        timestamps: false,
    });

    return House;
};

module.exports = HouseModel;
