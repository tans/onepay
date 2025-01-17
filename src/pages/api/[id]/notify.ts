import db from "@/lib/db"
import { fromXML } from "@/lib/wepay/helper"
import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ request }) => {
    const { id } = request.params
    const body = await request.text()
    const result = fromXML(body)
    console.log(result)
    const order = await db.onepay.findOne({ outTradeNo: result.out_trade_no })

    if (!order) {
        return new Response(`<xml>
            <return_code><![CDATA[FAIL]]></return_code>
            <return_msg><![CDATA[ORDER NOT FOUND]]></return_msg>
        </xml>`, {
            headers: {
                'Content-Type': 'application/xml'
            }
        })
    }

    if (result.return_code === "SUCCESS") {
        await db.onepay.updateOne({ _id: order._id }, { $set: { status: "paid" } })
        if (order.notifyUrl) {
            await fetch(order.notifyUrl, {
                method: "POST",
                body: JSON.stringify(order)
            })
        }
    }

    return new Response(`<xml>
        <return_code><![CDATA[SUCCESS]]></return_code>
        <return_msg><![CDATA[OK]]></return_msg>
      </xml>`, {
        headers: {
            'Content-Type': 'application/xml'
        }
    })
}