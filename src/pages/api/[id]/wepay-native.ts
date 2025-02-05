import Wepay from "@/lib/wepay";
import db from "@/lib/db";
import { ObjectId } from "mongodb";

let wepay = new Wepay(
    process.env.WEPAY_APPID,
    process.env.WEPAY_MCHID,
    process.env.WEPAY_SECRET,
);

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    const order = await db.onepay.findOne({ _id: new ObjectId(params.id) });
    if (!order) {
        return Response.json({ status: false, code: 404, message: "订单不存在" });
    }


    let result;
    let options = {
        trade_type: "NATIVE",
        body: "onepay 支付",
        product_id: order.outTradeNo,
        out_trade_no: order.outTradeNo,
        total_fee: order.fee,
        spbill_create_ip: "127.0.0.1",
        notify_url: `${process.env.HOST}/api/${order._id}/notify`,
        // redirect_url: order.redirectUrl || "",
    };

    result = await wepay.unifiedorder(options);

    return Response.json({ status: true, result });
};
