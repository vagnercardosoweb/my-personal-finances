import { DataTypes, QueryInterface } from 'sequelize';

import { TableNames } from '../table-names';
import { addDefaultColumns, addDefaultIndexes } from '../utils';

export default {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.createTable(
			TableNames.PROFILE,
			addDefaultColumns({
				softDelete: true,
				mergeColumns: {
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
					name: {
						type: DataTypes.STRING(80),
						allowNull: false,
					},
					access_code: {
						type: DataTypes.STRING(22),
						allowNull: true,
						unique: null,
					},
					password: {
						type: DataTypes.STRING(100),
						allowNull: true,
						defaultValue: null,
					},
					avatar_key: {
						type: DataTypes.STRING(180),
						allowNull: true,
						defaultValue: null,
					},
					enable_access_at: {
						type: DataTypes.DATE,
						allowNull: true,
						defaultValue: null,
					},
				},
			}),
		);

		await addDefaultIndexes({
			softDelete: true,
			tableName: TableNames.PROFILE,
			queryInterface,
		});

		await queryInterface.addIndex(TableNames.PROFILE, ['name']);
		await queryInterface.addIndex(TableNames.PROFILE, ['user_id']);
		await queryInterface.addIndex(TableNames.PROFILE, ['access_code']);
		await queryInterface.addIndex(TableNames.PROFILE, ['enable_access_at']);
	},
	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable(TableNames.PROFILE, { cascade: true });
	},
};
