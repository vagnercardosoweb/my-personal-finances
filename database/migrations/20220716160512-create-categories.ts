import { DataTypes, QueryInterface } from 'sequelize';

import { TableNames } from '../table-names';
import { addDefaultColumns, addDefaultIndexes } from '../utils';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(
      TableNames.CATEGORY,
      addDefaultColumns({
        softDelete: true,
        mergeColumns: {
          user_id: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: null,
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
            references: {
              key: 'id',
              model: TableNames.USER,
            },
          },
          parent_id: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: null,
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
            references: {
              key: 'id',
              model: TableNames.CATEGORY,
            },
          },
          name: {
            type: DataTypes.STRING(120),
            allowNull: false,
          },
          sort_order: {
            type: DataTypes.SMALLINT({ unsigned: true }),
            allowNull: false,
            defaultValue: 1,
          },
        },
      }),
    );

    await addDefaultIndexes({
      softDelete: true,
      tableName: TableNames.CATEGORY,
      queryInterface,
    });

    await queryInterface.addIndex(TableNames.CATEGORY, ['user_id']);
    await queryInterface.addIndex(TableNames.CATEGORY, ['sort_order']);
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(TableNames.CATEGORY, { cascade: true });
  },
};
