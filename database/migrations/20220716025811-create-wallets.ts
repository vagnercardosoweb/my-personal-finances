import { DataTypes, QueryInterface } from 'sequelize';

import { TableNames } from '../table-names';
import { addDefaultColumns, addDefaultIndexes } from '../utils';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(
      TableNames.WALLET,
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
          name: {
            type: DataTypes.STRING(120),
            allowNull: false,
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
          },
        },
      }),
    );

    await addDefaultIndexes({
      softDelete: true,
      tableName: TableNames.WALLET,
      queryInterface,
    });

    await queryInterface.addIndex(TableNames.WALLET, ['name']);
    await queryInterface.addIndex(TableNames.WALLET, ['user_id']);
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(TableNames.WALLET, { cascade: true });
  },
};
