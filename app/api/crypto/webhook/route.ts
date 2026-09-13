import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const token = process.env.CRYPTO_PAY_TOKEN?.trim();

    if (!token) {
      console.error('CRYPTO_PAY_TOKEN не найден в Environment Variables');
      return NextResponse.json({ error: 'CRYPTO_PAY_TOKEN is missing' }, { status: 500 });
    }

    // 1. Получаем сырое тело запроса для валидации HMAC подписи
    const rawBody = await req.text();
    const signature = req.headers.get('crypto-pay-api-signature');

    // 2. Официальная проверка подписи Crypto Pay (HMAC-SHA256)
    if (signature) {
      const secret = crypto.createHash('sha256').update(token).digest();
      const calculatedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (calculatedSignature !== signature) {
        console.warn('Отклонено: неверная цифровая подпись вебхука Crypto Pay');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
      }
    }

    // 3. Парсим событие от Crypto Bot
    const update = JSON.parse(rawBody);

    // Обрабатываем событие успешной оплаты счета
    if (update.update_type === 'invoice_paid') {
      const invoice = update.payload;
      console.log('Крипто-платеж успешно оплачен:', {
        invoiceId: invoice.invoice_id,
        amount: invoice.amount,
        asset: invoice.asset,
        paidAt: invoice.paid_at,
      });

      // Извлекаем переданные данные пользователя и купленного тарифа
      if (invoice.payload) {
        try {
          const customData = JSON.parse(invoice.payload);
          const { userId, tier } = customData;
          console.log(`Успешно оплачен тариф ${tier} для пользователя ${userId}`);
        } catch (parseErr) {
          console.warn('Не удалось распарсить custom payload счета:', parseErr);
        }
      }
    }

    // 4. Обязательно возвращаем статус 200 OK, чтобы Crypto Bot знал, что вебхук принят
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Ошибка в обработчике вебхука Crypto Pay:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
