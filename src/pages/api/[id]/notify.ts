import db from "@/lib/db"
import helper from "@/lib/wepay/helper"
import type { APIRoute } from "astro"

export const prerender = false
export const POST: APIRoute = async ({ request }) => {
    const { id } = request.params
    const body = await request.text()
    let result = helper.fromXML(body)
    result = result.xml || result
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