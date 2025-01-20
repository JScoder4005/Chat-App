// import { httpRouter } from 'convex/server';

// const validatePayload = async (
//   req: Request
// ): Promise<WebhookEvent | undefined> => {
//   const payload = await req.text();
// };

// const handleClerkWebhook = httpAction(async (ctx, req) => {
//   const event = await validatePayload(req);
// });

// const http = httpRouter();

// http.route({
//   path: '/clerk-user-weebhook',
//   method: 'POST',
//   handler: handleClerkWebhook,
// });

// import { httpRouter } from 'convex/server';
// import { httpAction } from './_generated/server';

// const validatePayload = async (
//   req: Request
// ): Promise<WebhookEvent | undefined> => {
//   const payload = await req.text();

//   const svixheaders = {
//     'svix-id': req.headers.get('svix-id'),
//     'svix-signature': req.headers.get('svix-signature'),
//     'svix-timestamp': req.headers.get('svix-timestamp'),
//     // "svix-token" : req.headers.get("svix-token"),
//   };

//   const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

//   try {
//     const event = webhook.verify(payload, svixheaders) as WebhookEvent;
//   } catch (error) {
//     console.error('Error verifying webhook signature:', error);
//     return;
//   }
// };

// const handleClerkWebhook = httpAction(async (ctx, req) => {
//   const event = await validatePayload(req);
// });

// const http = httpRouter();
// http.route({
//   path: '/clerk-user-webhook',
//   method: 'POST',
//   handler: handleClerkWebhook,
// });

// export default http;

import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { Webhook } from 'svix'; // Ensure you have the `svix` library installed

type WebhookEvent = {
  type: string;
  data: Record<string, any>;
};

const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();

  const svixHeaders = {
    'svix-id': req.headers.get('svix-id'),
    'svix-signature': req.headers.get('svix-signature'),
    'svix-timestamp': req.headers.get('svix-timestamp'),
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    return event; // Return the verified event
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return undefined; // Explicitly return undefined on error
  }
};

const handleClerkWebhook = httpAction(async (_ctx, req) => {
  const event = await validatePayload(req);
  if (!event) {
    return new Response('Invalid webhook signature', { status: 400 });
  }

  // Process the webhook event here
  console.log('Webhook event received:', event);

  return new Response('Webhook processed successfully', { status: 200 });
});

const http = httpRouter();
http.route({
  path: '/clerk-user-webhook',
  method: 'POST',
  handler: handleClerkWebhook,
});

export default http;
