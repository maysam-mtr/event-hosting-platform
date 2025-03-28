import { QueryInterface, Sequelize } from 'sequelize';

module.exports = {
    async up(queryInterface: QueryInterface, Sequelize: Sequelize): Promise<void> {
        await queryInterface.removeConstraint('latest_maps', 'latest_maps_idfk_1');
        await queryInterface.addConstraint('latest_maps', {
            fields: ['latest_map_id'],
            type: 'foreign key',
            name: 'latest_maps_idfk_1',
            references: {
                table: 'maps',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    },

    async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
        await queryInterface.removeConstraint('latest_maps', 'latest_maps_idfk_1');
        await queryInterface.addConstraint('latest_maps', {
            fields: ['latest_map_id'],
            type: 'foreign key',
            name: 'latest_maps_idfk_1',
            references: {
                table: 'maps',
                field: 'id',
            },
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE',
        });
    },
};
