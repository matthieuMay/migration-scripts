const { dbV3, dbV4 } = require('../config/database');
const {
  resolveDestTableName,
  resolveSourceTableName,
} = require('../migrate/helpers/tableNameHelpers');

const processedTables = [
  'components_recommend_content_macros',
  'components_recommend_content_macros_macro_links',
];

const tableV3 = 'components_recommend_content_macros';
async function migrateTables() {
  const originalData = await dbV3(resolveSourceTableName(tableV3)).select('*');

  const mainTableData = originalData.map((row) => ({ id: row.id }));
  const secondTableData = originalData.map((row) => ({
    macro_id: row.id,
    inv_macro_id: row.macro,
  }));

  await dbV4(resolveDestTableName(processedTables[0])).del();
  //   await dbV4(resolveDestTableName(processedTables[1])).truncate();
  if (originalData.length) {
    await dbV4(resolveDestTableName(processedTables[0])).insert(mainTableData);
    await dbV4(resolveDestTableName(processedTables[1])).insert(secondTableData);
  }
}

module.exports = {
  processedTables,
  migrateTables,
};
