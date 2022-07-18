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
            type: DataTypes.UUID,
            allowNull: false,
          },
          type: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'income',
          },
          position: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0,
          },
        },
      }),
    );

    await addDefaultIndexes({
      softDelete: true,
      tableName: TableNames.CATEGORY,
      queryInterface,
    });

    await queryInterface.addIndex(TableNames.CATEGORY, ['type']);
    await queryInterface.addIndex(TableNames.CATEGORY, ['position']);

    await queryInterface.addConstraint(TableNames.CATEGORY, {
      type: 'check',
      fields: ['type'],
      where: { type: ['income', 'expense'] },
      name: `${TableNames.CATEGORY}_type_ck`,
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(TableNames.CATEGORY, { cascade: true });
  },
};
