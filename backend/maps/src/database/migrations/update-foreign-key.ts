
import { QueryInterface, Sequelize } from 'sequelize';

module.exports = {
    async up(queryInterface: QueryInterface, Sequelize: Sequelize): Promise<void> {
        // Remove the existing foreign key constraint
        await queryInterface.removeConstraint('maps', 'latest_maps_ibfk_1');

        // Add a new foreign key constraint with ON DELETE CASCADE
        await queryInterface.addConstraint('maps', {
            fields: ['latest_map_id'],
            type: 'foreign key',
            name: 'latest_maps_ibfk_1', // Keep the same name for consistency
            references: {
                table: 'latest_maps',
                field: 'id',
            },
            onDelete: 'CASCADE', // Delete associated maps when a latest_map is deleted
            onUpdate: 'CASCADE',
        });
    },

    async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
        // Revert the changes if needed
        await queryInterface.removeConstraint('maps', 'latest_maps_ibfk_1');
        await queryInterface.addConstraint('maps', {
            fields: ['latest_map_id'],
            type: 'foreign key',
            name: 'latest_maps_ibfk_1',
            references: {
                table: 'latest_maps',
                field: 'id',
            },
            onDelete: 'NO ACTION', // Revert to the original behavior
            onUpdate: 'CASCADE',
        });
    },
};
