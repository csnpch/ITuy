interface ErrMsgInterface {
    api: {
      connect: string;
    };
    auth: {
      requestAuth: string;
    };
}


const errMsg: ErrMsgInterface = {
    api: {
        connect: 'เกิดข้อผิดพลาดในการส่งคำขอ'
    },
    auth: {
        requestAuth: 'เกิดข้อผิดพลาดในการสร้างคำขอ',
    },
}


export {
    errMsg
}
