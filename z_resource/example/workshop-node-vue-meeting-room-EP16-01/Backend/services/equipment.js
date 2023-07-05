const connection = require('../configs/database');
const config = require('../configs');
const table = 'tb_equipments';
module.exports = {
    // แสดงข้อมูลทั้งหมดเพื่อเอาไปทำเป็น list checkbox หน้าเพิ่มการจอง
    findAll() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT eq_id, eq_image, eq_name FROM ${table}`, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },
    find(value) {
        return new Promise((resolve, reject) => {
            const limitPage = config.limitPage;
            const startPage = ((value.page || 1) - 1) * limitPage;
            const sqls = {
                count: 'SELECT COUNT(*) AS rows FROM tb_equipments',
                select: 'SELECT * FROM tb_equipments'
            };

            if (value.search_key && value.search_text) {
                const key = value.search_key;
                const txt = value.search_text;
                const sqlSerch = ` WHERE ${connection.escapeId(key)} LIKE ${connection.escape(`%${txt}%`)}`;
                sqls.count += sqlSerch;
                sqls.select += sqlSerch;
            }

            // เรียงลำดับข้อมูล
            sqls.select += ' ORDER BY eq_updated DESC';

            // หาจำนวนแถว
            connection.query(sqls.count, (error, result) => {
                if (error) return reject(error);
                const items = { result: [], rows: result[0].rows, limit: limitPage };

                // แบ่งหน้า page
                sqls.select += ` LIMIT ${connection.escape(startPage)},${limitPage}`;
                connection.query(sqls.select, (error, result) => {
                    if (error) return reject(error);
                    items.result = result;
                    resolve(items);
                });
            });
        });
    },
    findOne(column) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM tb_equipments WHERE ?', column, (error, result) => {
                if (error) return reject(error);
                resolve(result.length > 0 ? result[0] : null);
            });
        });
    },
    onCreate(value) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO tb_equipments SET ?', value, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },
    onDelete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM tb_equipments WHERE eq_id=?', [id], (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },
    onUpdate(id, value) {
        return new Promise((resolve, reject) => {
            const $query = `
                UPDATE tb_equipments SET
                    eq_name = ?,
                    eq_detail = ?,
                    eq_image = ?,
                    eq_updated = NOW()
                WHERE 
                    eq_id = ?`;
            connection.query($query, [value.eq_name, value.eq_detail, value.eq_image, id],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
        });
    }
};