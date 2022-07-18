import { DataTypes, literal, QueryInterface } from 'sequelize';

import { TableNames } from '../table-names';
import { makeColumnUuid } from '../utils';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(TableNames.INVITED_BY_USER, {
      id: makeColumnUuid(),
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          key: 'id',
          model: TableNames.USER,
        },
      },
      guest_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          key: 'id',
          model: TableNames.USER,
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('NOW()'),
      },
    });

    await queryInterface.addIndex(TableNames.INVITED_BY_USER, ['id']);
    await queryInterface.addIndex(TableNames.INVITED_BY_USER, ['user_id']);
    await queryInterface.addIndex(TableNames.INVITED_BY_USER, ['guest_id']);
    await queryInterface.addIndex(TableNames.INVITED_BY_USER, ['created_at']);

    await queryInterface.addConstraint(TableNames.INVITED_BY_USER, {
      type: 'unique',
      name: `${TableNames.INVITED_BY_USER}_user_id_guest_id_uk`,
      fields: ['user_id', 'guest_id'],
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(TableNames.INVITED_BY_USER, {
      cascade: true,
    });
  },
};
