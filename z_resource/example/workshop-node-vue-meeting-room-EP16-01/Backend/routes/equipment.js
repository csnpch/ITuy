const router = require('express').Router();
const service = require('../services/equipment');
const { check, query } = require('express-validator/check');
const base64Img = require('base64-img');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve('uploads');
const equipDir = path.join(uploadDir, 'equipments');

// แสดงข้อมูลอุปกรณ์
router.get('/', [
    query('page').not().isEmpty().isInt().toInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await service.find(req.query));
    }
    catch (ex) { res.error(ex); }
});

// แสดงข้อมูลอุปกรณ์แค่ 1 recode เพื่อเอาไปแก้ไข
router.get('/:id', async (req, res) => {
    try {
        const equipment = await service.findOne({ eq_id: req.params.id });
        if (!equipment) throw new Error('Not found item.');
        equipment.eq_image = base64Img.base64Sync(path.join(equipDir, equipment.eq_image));
        res.json(equipment);
    }
    catch (ex) { res.error(ex); }
});

// เพิ่มข้อมูลอุปกรณ์
router.post('/', [
    check('eq_name').not().isEmpty(),
    check('eq_image').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate();

        // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        if (!fs.existsSync(equipDir)) fs.mkdirSync(equipDir);

        // แปลงข้อมูลรูปภาพ
        req.body.eq_image = base64Img
            .imgSync(req.body.eq_image, equipDir, `equip-${Date.now()}`)
            .replace(`${equipDir}/`, '');

        res.json({ message: await service.onCreate(req.body) });
    }
    catch (ex) {
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(equipDir, req.body.eq_image || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex);
    }
});

// ลบข้อมูลอุปกรณ์
router.delete('/:id', async (req, res) => {
    try {
        const item = await service.findOne({ eq_id: req.params.id });
        if (!item) throw new Error('Not found item.');
        const deleteItem = await service.onDelete(item.eq_id);
        const deleteImg = path.join(equipDir, item.eq_image);
        if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);
        res.send(deleteItem);
    }
    catch (ex) { res.error(ex); }
});

// แก้ไขข้อมูลอุปกรณ์
router.put('/:id', [
    check('eq_name').not().isEmpty(),
    check('eq_image').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate();

        // หาข้อมูลที่จะแก้ไข
        const item = await service.findOne({ eq_id: req.params.id });
        if (!item) throw new Error('Not found item.');

        // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        if (!fs.existsSync(equipDir)) fs.mkdirSync(equipDir);

        // แปลงข้อมูลรูปภาพ
        req.body.eq_image = base64Img
            .imgSync(req.body.eq_image, equipDir, `equip-${Date.now()}`)
            .replace(`${equipDir}/`, '');

        const updateItem = await service.onUpdate(req.params.id, req.body);

        // ตรวจสอบว่าแก้ไขข้อมูลได้หรือไม่
        if (updateItem.affectedRows > 0) {
            const deleteImg = path.join(equipDir, item.eq_image);
            if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);
        }

        res.json(updateItem);
    }
    catch (ex) {
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(equipDir, req.body.eq_image || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex);
    }
});

module.exports = router;