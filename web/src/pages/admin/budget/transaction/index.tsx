import FloatingBtnAddBill from "@/components/FloatingBtnAdd";
import AccordionReportTnx from "@/components/admin/transaction/AccordionReportTnx";
import ModalAddTnx from "@/components/admin/transaction/ModalAddTnx";
import LayoutMain from "@/components/layouts/main";
import PrepareDataStore from "@/components/store/PrepareDataStore";
import { routes } from "@/data/dict/routes_dict";
import { TnxServices } from "@/services/api/transaction";
import { RootState } from "@/store";
import { getAccessToken } from "@/store/slices/authSlice";
import { timerSwal } from "@/utils/sweetAlert";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";




export default function TransactionPage() {

    const router = useRouter()

    // stores
    const accessToken = useSelector((state: RootState) => getAccessToken(state))
    // states
    const [modalAddTnx, setModalAddTnx] = useState<boolean>(false)

    const handleSumbitFormModalAddTnx = async (typeAction: string, dataForm: any) => {
        console.log(typeAction, dataForm)
        if (typeAction === 'insert') {
            try {
                await TnxServices.addTnx(accessToken, dataForm)
                timerSwal({
                    title: 'สร้างคำขอเบิกงบประมาณสำเร็จ',
                    icon: 'success',
                })
                setTimeout(() => { 
                    router.push(
                        routes.budget.path 
                        + '?sendBack=' + routes.admin_budget_transaction.path) 
                }, 1800)
                onResetFormAddTnx()
                setModalAddTnx(false)
            } catch (err: any) {
                timerSwal({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    subTitle: 'ไม่สามารถเพิ่มข้อมูลได้ในขณะนี้, โปรดลองใหม่ในภายหลัง',
                })
            }
        }
    }


    // trigger reset form add tnx
    const onResetFormAddTnx = () => { }


    return (
        <>
        
            <LayoutMain
                navbarDarkTheme
                subNavbar
                splashWhiteScreen
                widthFull
                previousRoute={routes.budget}
                currentRoute={routes.admin_budget_transaction}
            >

                <PrepareDataStore
                    client
                />
                
                <FloatingBtnAddBill 
                    triggerState={{
                        valueIs: modalAddTnx,
                        setValue: setModalAddTnx
                    }}
                />

                <ModalAddTnx
                    resetForm={onResetFormAddTnx}
                    modalState={{
                        isOpen: modalAddTnx,
                        setOpen: setModalAddTnx
                    }}
                    onSubmitForm={handleSumbitFormModalAddTnx}
                />


                <div className='p-5 mb-10 mx-auto xl:w-[40%]'>

                    <p className={`mt-6 xl:mt-14 ml-0.5 mb-3 xl:mb-6 text-purple-700 text-lg xl:text-center`}>
                        รายการธุรกรรมสาขา
                    </p>

                    <AccordionReportTnx
                        className={`mt-2 w-full mx-auto`}
                    />

                </div>
                
            </LayoutMain>

        </>
    )

}