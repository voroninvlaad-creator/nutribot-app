import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN is missing' }, { status: 500 });
    }

    const update = await req.json();

    // 1. Обязательное подтверждение списания звёзд
    if (update.pre_checkout_query) {
      const queryId = update.pre_checkout_query.id;
      await fetch(`https://api.telegram.org/bot${botToken}/answerPreCheckoutQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pre_checkout_query_id: queryId,
          ok: true, // Даем разрешение Telegram списать звёзды
        }),
      });
      return NextResponse.json({ ok: true });
    }

    // 2. Уведомление об успешном завершении оплаты
    if (update.message?.successful_payment) {
      console.log('Звёзды успешно списаны:', update.message.successful_payment);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Ошибка вебхука:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
