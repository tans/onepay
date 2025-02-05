import { AlipaySdk } from 'alipay-sdk';
import db from '@/lib/db';
import { ObjectId } from 'mongodb';

export const prerender = false;

const config = {
    appId: process.env.ALIPAY_APPID,
    privateKey: process.env.ALIPAY_PRIVATE_KEY,
    alipayPublicKey: process.env.ALIPAY_PLA_PUBLIC_KEY,
    // publicKey: process.env.ALIPAY_APP_PUBLIC_KEY,
    signType: 'RSA2',
}

const alipaySdk = new AlipaySdk(config);

export const GET = async ({ params }) => {
    const { id } = params;
    let order = await db.onepay.findOne({ _id: ObjectId(id) })
    if (!order) {
        return Response.json({ status: false, message: '订单不存在' });
    }

    if (order.status === 'paid') {
        return Response.json({ status: false, message: '订单已支付' });
    }

    let result = await alipaySdk.pageExecute('alipay.trade.wap.pay', {
        bizContent: {
            out_trade_no: order._id.toString(),
            total_amount: order.fee / 100,
            subject: order.title || '订单支付',
            body: order.body || '-',
            product_code: 'QUICK_WAP_WAY',
        },
        notifyUrl: 'https://onepay.com/api/notify',
        returnUrl: order.redirectUrl || "",
    })

    return new Response(result, {
        headers: {
            'Content-Type': 'text/html',
        },
    });
};
