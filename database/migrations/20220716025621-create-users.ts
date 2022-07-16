import { DataTypes, QueryInterface } from 'sequelize';

import { TableNames } from '../table-names';
import { addDefaultColumns, addDefaultIndexes } from '../utils';

export default {
	up: async (queryInterface: QueryInterface) => {
		await queryInterface.sequelize.query(
			'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
		);

		await queryInterface.createTable(
			TableNames.USER,
			addDefaultColumns({
				softDelete: true,
				mergeColumns: {
					name: {
						type: DataTypes.STRING(80),
						allowNull: false,
					},
					email: {
						type: DataTypes.STRING(120),
						allowNull: false,
						unique: true,
					},
					birth_date: {
						type: DataTypes.DATE,
						allowNull: false,
					},
					code_to_invite: {
						type: DataTypes.STRING(25),
						allowNull: false,
					},
					avatar_key: {
						type: DataTypes.STRING(220),
						allowNull: true,
						defaultValue: null,
					},
					password: {
						type: DataTypes.STRING(100),
						allowNull: false,
					},
				},
			}),
		);

		await addDefaultIndexes({
			softDelete: true,
			tableName: TableNames.USER,
			queryInterface,
		});

		await queryInterface.addIndex(TableNames.USER, ['email']);
		await queryInterface.addIndex(TableNames.USER, ['code_to_invite']);
		await queryInterface.addIndex(TableNames.USER, ['birth_date']);
	},
	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable(TableNames.USER, { cascade: true });
	},
};
