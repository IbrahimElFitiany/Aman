const { DataTypes, UniqueConstraintError } = require('sequelize');

const EmployeeModel = (sequelize) => {
    const Employee = sequelize.define('Employee', {
        emp_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fname:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lname:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        ssn:{
            type: DataTypes.INTEGER,
            allowNull:false,
            unique: true
        },
        role: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isIn: [['admin', 'security_emp']],
            }
        },
        emp_username: {
            type: DataTypes.STRING(50),
            unique:true,
            allowNull: false
        },
        emp_password: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        tableName: 'employees',
        timestamps: false, // Disable timestamps if not needed
    });

    return Employee;
};

module.exports = EmployeeModel;
