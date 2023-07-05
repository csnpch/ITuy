const router = require('express').Router();
const { query, check, param } = require('express-validator/check');
const roomService = require('../services/room');
const bookingService = require('../services/booking');
const equipmentService = require('../services/equipment');
const { isInRoles } = require('../configs/security');

// แสดงรายการห้องประชุมที่จะทำการจอง
router.get('/', [
    query('page').isInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await roomService.find(req.query));
    }
    catch (ex) { res.error(ex); }
});

// แสดงข้อมูลอุปกรณ์ห้องประชุมเพื่อเอาไปทำ list checkbox
router.get('/equipments', async (req, res) => {
    try {
        res.json(await equipmentService.findAll());
    }
    catch (ex) { res.error(ex); }
});

// แสดงประวัติการจองห้องประชุม
router.get('/history', [
    query('page').isInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await bookingService.findHistory(
            req.query,
            req.session.userLogin.u_id
        ));
    }
    catch (ex) { res.error(ex); }
});

// แสดงรายละเอียดของห้องประชุม
router.get('/room/:id', async (req, res) => {
    try {
        const model = await roomService.findDetailForBooking(req.params.id);
        if (!model) throw new Error('Not found item.');
        res.json(model);
    }
    catch (ex) { res.error(ex); }
});

// เพิ่มการจองห้องประชุม
router.post('/', [
    check('tb_rooms_r_id').isInt(),
    check('bk_title').not().isEmpty(),
    check('bk_detail').exists(),
    check('bk_time_start').custom(value => !isNaN(Date.parse(value))),
    check('bk_time_end').custom(value => !isNaN(Date.parse(value))),
    check('equipments').custom(values => {
        const isArray = Array.isArray(values);
        if (isArray && values.length > 0) {
            return values.filter(item => isNaN(item)).length == 0;
        }
        return isArray;
    })
], async (req, res) => {
    try {
        req.validate();
        req.body.tb_users_u_id = req.session.userLogin.u_id;
        res.json(await bookingService.onCreate(req.body));
    }
    catch (ex) { res.error(ex); }
});

// ดึงข้อมูลห้องประชุมมาทำ Select
router.get('/rooms/select', async (req, res) => {
    try {
        res.json(await roomService.findSelect());
    }
    catch (ex) { res.error(ex); }
});

//#region สำหรับผู้ดูและระบบ 

// ดึงข้อมูลการจองห้องประชุมจาก room id มาใส่ใน calendar
router.get('/calendar/room/:id', isInRoles(['admin']), [
    param('id').isInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await bookingService.findByRoomId(req.params.id));
    }
    catch (ex) { res.error(ex); }
});

// แสดงรายการจองห้องประชุมของสมาชิก
router.get('/manage', isInRoles(['admin']), [
    query('page').isInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await bookingService.find(req.query));
    }
    catch (ex) { res.error(ex); }
});

// แก้ไขสถานะการจองเป็น อนุมัติ กับ ไม่อนุมัติ
router.put('/manage/:id', isInRoles(['admin']), [
    param('id').isInt(),
    check('bk_status').isIn(['allowed', 'not allowed'])
], async (req, res) => {
    try {
        req.validate();
        const findItem = await bookingService.findById(req.params.id);
        if (!findItem) throw new Error('Not found item.');
        res.json(await bookingService.onUpdate(findItem.bk_id, req.body));
    }
    catch (ex) { res.error(ex); }
});

// ลบข้อมูลห้องประชุม
router.delete('/manage/:id', isInRoles(['admin']), [
    param('id').isInt()
], async (req, res) => {
    try {
        req.validate();
        const findItem = await bookingService.findById(req.params.id);
        if (!findItem) throw new Error('Not found item.');
        res.json(await bookingService.onDelete(findItem.bk_id));
    }
    catch (ex) { res.error(ex); }
});

//#endregion

module.exports = router;