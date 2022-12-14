import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../../util/redis'

type FinchPaymentRes = {
    paging: {
        count: number
        offset: number
    },
    individuals: FinchEmployee[]
}

export default async function Payment(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.method + " /api/finch/payment")
    const { start_date, end_date } = req.query

    if (req.method == 'GET') {
        try {
            const token = await redis.get('current_connection')

            const paymentRes = await axios.request<FinchPaymentRes>({
                method: 'get',
                url: `https://api.tryfinch.com/employer/payment?start_date=${start_date}&end_date=${end_date}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Finch-API-Version': '2020-09-17'
                },
            })

            // Get payroll successful, return back to location
            return res.status(200).json({ data: paymentRes.data })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ msg: "Error retrieving payments" })
        }
    }

    return res.status(405).json({ msg: "Method not implemented." })


}