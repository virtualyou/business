import db from './index';

module.exports = async () => {
  // close Sequelize connections here
  await db.sequelize.close();
};
