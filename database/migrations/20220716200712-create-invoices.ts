import { DataTypes, QueryInterface } from 'sequelize';

import { TableNames } from '../table-names';
import { addDefaultColumns, addDefaultIndexes } from '../utils';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(
      TableNames.INVOICE,
      addDefaultColumns({
        softDelete: true,
        mergeColumns: {
          user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
            references: {
              key: 'id',
              model: TableNames.USER,
            },
          },
          wallet_id: {
            type: DataTypes.UUID,
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
            references: {
              key: 'id',
              model: TableNames.WALLET,
            },
          },
          category_id: {
            type: DataTypes.UUID,
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
            references: {
              key: 'id',
              model: TableNames.CATEGORY,
            },
          },
          type: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'income',
          },
          value: {
            type: DataTypes.FLOAT(10, 2),
            allowNull: false,
            defaultValue: 0,
          },
          repeatable: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: false,
          },
          total_installments: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
          },
          start_at: {
            type: DataTypes.DATEONLY,
            allowNull: false,
          },
          end_at: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: null,
          },
        },
      }),
    );

    await addDefaultIndexes({
      softDelete: true,
      tableName: TableNames.INVOICE,
      queryInterface,
    });

    await queryInterface.addIndex(TableNames.INVOICE, ['wallet_id']);

    await queryInterface.addConstraint(TableNames.INVOICE, {
      type: 'check',
      fields: ['type'],
      where: { type: ['income', 'expense'] },
      name: `${TableNames.INVOICE}_type_ck`,
    });

    await queryInterface.addConstraint(TableNames.INVOICE, {
      type: 'check',
      fields: ['repeatable'],
      name: `${TableNames.CATEGORY}_repeatable_ck`,
      where: {
        repeatable: [
          'single',
          'daily',
          'weekly',
          'biweekly',
          'monthly',
          'yearly',
        ],
      },
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(TableNames.INVOICE, { cascade: true });
  },
};
