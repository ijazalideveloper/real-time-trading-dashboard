import { NextRequest } from 'next/server';

const API_KEY = process.env.FINNHUB_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get('symbols')?.split(',') || [];

  const stream = new ReadableStream({
    start(controller) {
      const ws = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);
      
      ws.onopen = () => {
        symbols.forEach(symbol => {
          ws.send(JSON.stringify({ type: 'subscribe', symbol }));
        });
      };

      ws.onmessage = (event) => {
        controller.enqueue(`data: ${event.data}\n\n`);
      };

      ws.onclose = () => {
        controller.close();
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        controller.error(error);
      };
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}