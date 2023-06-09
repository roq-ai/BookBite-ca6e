import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { orderItemsValidationSchema } from 'validationSchema/order-items';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getOrderItems();
    case 'POST':
      return createOrderItems();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOrderItems() {
    const data = await prisma.order_items.findMany({});
    return res.status(200).json(data);
  }

  async function createOrderItems() {
    await orderItemsValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.order_items.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
