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
			profile_id: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					key: 'id',
					model: TableNames.PROFILE,
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
			success: {
				type: DataTypes.BOOLEAN,
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
				allowNull: true,
				defaultValue: [],
			},
			user_agent: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: literal('CURRENT_TIMESTAMP'),
			},
		});

		await queryInterface.addIndex(tableName, ['id']);
		await queryInterface.addIndex(tableName, ['profile_id']);
		await queryInterface.addIndex(tableName, ['created_at']);
		await queryInterface.addIndex(tableName, ['success']);
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable(tableName, { cascade: true });
	},
};
