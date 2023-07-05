const connection = require('../configs/database');
const config = require('../configs');
const table = 'tb_rooms';
module.exports = {
    findSelect() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT r_id, r_name FROM ${table}`, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },
    findDetailForBooking(id) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT 
                    r_id,
                    r_image,
                    r_name,
                    r_capacity,
                    (SELECT COUNT(*) FROM tb_bookings WHERE tb_rooms_r_id = r_id AND bk_status = 'pending') AS r_booking,
                    r_detail
                FROM ${table}
                WHERE r_id = ?`, [id], (error, result) => {
                    if (error) return reject(error);
                    resolve(result.length == 0 ? null : result[0]);
                });
        });
    },
    find(value) {
        return new Promise((resolve, reject) => {
            const limitPage = config.limitPage;
            const startPage = ((value.page || 1) - 1) * limitPage;
            const sqls = {
                count: `SELECT COUNT(*) AS rows FROM ${table}`,
                select: `SELECT * FROM ${table}`
            };

            if (value.search_key && value.search_text) {
                const key = value.search_key;
                const txt = value.search_text;
                const sqlSerch = ` WHERE ${connection.escapeId(key)} LIKE ${connection.escape(`%${txt}%`)}`;
                sqls.count += sqlSerch;
                sqls.select += sqlSerch;
            }

            // เรียงลำดับข้อมูล
            sqls.select += ' ORDER BY r_updated DESC';

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
            connection.query(`SELECT * FROM ${table} WHERE ?`, column, (error, result) => {
                if (error) return reject(error);
                resolve(result.length > 0 ? result[0] : null);
            });
        });
    },
    onCreate(value) {
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO ${table} SET ?`, value, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },
    onDelete(id) {
        return new Promise((resolve, reject) => {
            connection.query(`DELETE FROM ${table} WHERE r_id=?`, [id], (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },
    onUpdate(id, value) {
        return new Promise((resolve, reject) => {
            const $query = `
                UPDATE ${table} SET
                    r_name = ?,
                    r_capacity = ?,
                    r_detail = ?,
                    r_image = ?,
                    r_updated = NOW()
                WHERE 
                    r_id = ?`;
            connection.query($query, [value.r_name, value.r_capacity, value.r_detail, value.r_image, id], (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }
};