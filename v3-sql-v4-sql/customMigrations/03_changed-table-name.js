const { dbV3, dbV4 } = require('../config/database');
const {
  resolveDestTableName,
  resolveSourceTableName,
} = require('../migrate/helpers/tableNameHelpers');

const processedTables = [
  'comp_recommendations_masterclass_wrappers',
  'comp_recommendations_masterclass_wrappers_masterclass_links',
];

const tableV3 = 'components_recommendations_masterclass_wrappers';
async function migrateTables() {
  const originalData = await dbV3(resolveSourceTableName(tableV3)).select('*');

  const mainTableData = originalData.map((row) => ({ id: row.id }));
  const secondTableData = originalData.map((row) => ({
    masterclass_wrapper_id: row.id,
    masterclass_id: row.masterclass,
  }));

  //   await dbV4(resolveDestTableName(processedTables[0])).truncate();
  //   await dbV4(resolveDestTableName(processedTables[1])).truncate();
  await dbV4(resolveDestTableName(processedTables[0])).insert(mainTableData);
  await dbV4(resolveDestTableName(processedTables[1])).insert(secondTableData);
}

module.exports = {
  processedTables,
  migrateTables,
};
