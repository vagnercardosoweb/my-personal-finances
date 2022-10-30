import { DataTypes, literal, QueryInterface } from 'sequelize';

import { TableNames } from '../table-names';

const tableName = TableNames.ACCESS_LOG;

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(tableName, {
      id: {
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
        primaryKey: true,
        defaultValue: literal('uuid_generate_v4()'),
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          key: 'id',
          model: TableNames.USER,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      state: {
        type: DataTypes.STRING(8),
        defaultValue: true,
        allowNull: false,
      },
      platform: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      version: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
      },
      ip_address: {
        type: DataTypes.ARRAY(DataTypes.STRING(39)),
        allowNull: false,
        defaultValue: [],
      },
      user_agent: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('NOW()'),
      },
    });

    await queryInterface.addIndex(tableName, ['id']);
    await queryInterface.addIndex(tableName, ['user_id']);
    await queryInterface.addIndex(tableName, ['created_at']);
    await queryInterface.addIndex(tableName, ['state']);

    await queryInterface.addConstraint(tableName, {
      type: 'check',
      name: `${tableName}_state_ck`,
      fields: ['state'],
      where: { state: ['success', 'failed'] },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(tableName, { cascade: true });
  },
};
