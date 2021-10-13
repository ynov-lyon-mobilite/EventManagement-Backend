module.exports = {
  client: {
    excludes: ['**/**/__generated__.ts'],
    service: {
      name: 'BT Schema',
      localSchemaFile: './schema.gql',
    },
  },
};
