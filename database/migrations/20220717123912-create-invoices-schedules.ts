import { DataTypes, QueryInterface } from 'sequelize';

import { TableNames } from '../table-names';
import { addDefaultColumns, addDefaultIndexes } from '../utils';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(
      TableNames.INVOICE_SCHEDULE,
      addDefaultColumns({
        softDelete: true,
        mergeColumns: {
          invoice_id: {
            type: DataTypes.UUID,
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            references: {
              key: 'id',
              model: TableNames.INVOICE,
            },
          },
          installment_number: {
            type: DataTypes.SMALLINT({ unsigned: true }),
            allowNull: false,
            defaultValue: 1,
          },
          due_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
          },
          paid_at: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: null,
          },
          unpaid_at: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: null,
          },
          status: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'unpaid',
          },
        },
      }),
    );

    await addDefaultIndexes({
      softDelete: true,
      tableName: TableNames.INVOICE_SCHEDULE,
      queryInterface,
    });

    await queryInterface.addIndex(TableNames.INVOICE_SCHEDULE, ['status']);
    await queryInterface.addIndex(TableNames.INVOICE_SCHEDULE, ['invoice_id']);
    await queryInterface.addIndex(TableNames.INVOICE_SCHEDULE, ['paid_at']);
    await queryInterface.addIndex(TableNames.INVOICE_SCHEDULE, ['unpaid_at']);

    await queryInterface.addConstraint(TableNames.INVOICE, {
      type: 'check',
      fields: ['status'],
      where: { status: ['paid', 'unpaid'] },
      name: `${TableNames.CATEGORY}_status_ck`,
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(TableNames.INVOICE_SCHEDULE, {
      cascade: true,
    });
  },
};
