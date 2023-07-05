import React from 'react'
import { Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface DataType {
  key: string
  id: string,
  nameBill: string
  holdPay: number
  successPay: number
  tags: string[]
}

const columns: ColumnsType<DataType> = [
  {
    title: 'ชื่อบิล',
    dataIndex: 'nameBill',
    key: 'nameBill',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'ยังไม่ชำระ',
    dataIndex: 'holdPay',
    key: 'holdPay',
  },
  {
    title: 'ชำระเงินแล้ว',
    dataIndex: 'successPay',
    key: 'successPay',
  },
  {
    title: 'สถานะ',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = (
            tag === 'สำเร็จ' ? 'green' : 
            tag === 'ยังชำระไม่ครบ' ? 'geekblue' :
            tag === 'ปิดบิลแล้ว' ? 'volcano' : ''
          ) 
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          )
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
      </Space>
    ),
  },
]

const data: DataType[] = [
  {
    id: '1',
    key: '1',
    nameBill: 'บายสีสู่ขวัญ',
    holdPay: 32,
    successPay: 32 + 10,
    tags: ['ยังชำระไม่ครบ'],
  },
  {
    id: '2',
    key: '2',
    nameBill: 'บายเนียร์ 22, 23',
    holdPay: 42,
    successPay: 42 + 10,
    tags: ['ยังชำระไม่ครบ'],
  },
  {
    id: '3',
    key: '3',
    nameBill: 'ทำซุ้มจบ',
    holdPay: 32,
    successPay: 32 + 10,
    tags: ['สำเร็จ', 'ปิดบิลแล้ว'],
  },
]



export default function TableReportBill() {
    return (
        <>
            <p>รายงานสถานะบิล</p>

            <div className={`w-full mt-4`}>
                <Table 
                    columns={columns} 
                    dataSource={data} 
                    scroll={{ x: 'max-content' }} // enable horizontal scrolling
                    className={`font_kanit`}
                    rowClassName={`font_kanit`}
                />
            </div>
        </>
    )
}