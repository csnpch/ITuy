const router = require('express').Router();
const service = require('../services/room');
const { check, query } = require('express-validator/check');
const base64Img = require('base64-img');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve('uploads');
const roomDir = path.join(uploadDir, 'rooms');

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

// แสดงข้อมูลห้องประชุมแค่ 1 recode เพื่อเอาไปแก้ไข
router.get('/:id', async (req, res) => {
    try {
        const model = await service.findOne({ r_id: req.params.id });
        if (!model) throw new Error('Not found item.');
        model.r_image = base64Img.base64Sync(path.join(roomDir, model.r_image));
        res.json(model);
    }
    catch (ex) { res.error(ex); }
});

// เพิ่มข้อมูลห้องประชุม
router.post('/', [
    check('r_image').not().isEmpty(),
    check('r_name').not().isEmpty(),
    check('r_capacity').isInt(),
    check('r_detail').exists(),
], async (req, res) => {
    try {
        req.validate();

        // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        if (!fs.existsSync(roomDir)) fs.mkdirSync(roomDir);

        // แปลงข้อมูลรูปภาพ
        req.body.r_image = base64Img
            .imgSync(req.body.r_image, roomDir, `room-${Date.now()}`)
            .replace(`${roomDir}/`, '');

        res.json({ message: await service.onCreate(req.body) });
    }
    catch (ex) {
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(roomDir, req.body.r_image || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex);
    }
});

// ลบข้อมูลห้องประชุม
router.delete('/:id', async (req, res) => {
    try {
        const item = await service.findOne({ r_id: req.params.id });
        if (!item) throw new Error('Not found item.');
        const deleteItem = await service.onDelete(item.r_id);
        const deleteImg = path.join(roomDir, item.r_image);
        if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);
        res.send(deleteItem);
    }
    catch (ex) { res.error(ex); }
});

// แก้ไขข้อมูลห้องประชุม
router.put('/:id', [
    check('r_image').not().isEmpty(),
    check('r_name').not().isEmpty(),
    check('r_capacity').isInt(),
    check('r_detail').exists(),
], async (req, res) => {
    try {
        req.validate();

        // หาข้อมูลที่จะแก้ไข
        const item = await service.findOne({ r_id: req.params.id });
        if (!item) throw new Error('Not found item.');

        // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        if (!fs.existsSync(roomDir)) fs.mkdirSync(roomDir);

        // แปลงข้อมูลรูปภาพ
        req.body.r_image = base64Img
            .imgSync(req.body.r_image, roomDir, `room-${Date.now()}`)
            .replace(`${roomDir}/`, '');

        const updateItem = await service.onUpdate(req.params.id, req.body);

        // ตรวจสอบว่าแก้ไขข้อมูลได้หรือไม่
        if (updateItem.affectedRows > 0) {
            const deleteImg = path.join(roomDir, item.r_image);
            if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);
        }

        res.json(updateItem);
    }
    catch (ex) {
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(roomDir, req.body.r_image || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex);
    }
});

module.exports = router;