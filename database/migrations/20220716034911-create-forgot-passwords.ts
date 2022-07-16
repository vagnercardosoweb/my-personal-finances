import { DataTypes, literal, QueryInterface } from 'sequelize';

import { TableNames } from '../table-names';

const tableName = TableNames.FORGOT_PASSWORDS;

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
					model: tableName,
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
			token_uuid: {
				type: DataTypes.UUID,
				allowNull: false,
				defaultValue: literal('uuid_generate_v4()'),
			},
			token_random: {
				type: DataTypes.STRING(8),
				allowNull: false,
			},
			validated_in: {
				type: DataTypes.DATE,
				allowNull: true,
				defaultValue: null,
			},
			expired_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: literal('CURRENT_TIMESTAMP'),
			},
		});

		await queryInterface.addIndex(tableName, ['id']);
		await queryInterface.addIndex(tableName, ['user_id']);
		await queryInterface.addIndex(tableName, ['token_uuid']);
		await queryInterface.addIndex(tableName, ['token_random']);
		await queryInterface.addIndex(tableName, ['validated_in']);
		await queryInterface.addIndex(tableName, ['expired_at']);
		await queryInterface.addIndex(tableName, ['created_at']);

		await queryInterface.addConstraint(tableName, {
			type: 'unique',
			fields: ['user_id', 'token_uuid', 'token_random'],
			name: `${tableName}_user_id_token_uuid_token_random_uk`,
		});
	},

	down: async (queryInterface: QueryInterface) => {
		await queryInterface.dropTable(tableName, { cascade: true });
	},
};
