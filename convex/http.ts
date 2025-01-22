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
import { internal } from './_generated/api';
type WebhookEvent = {
  type: string;
  data: Record<string, any>;
};

const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();

  const svixHeaders: Record<string, string> = {
    'svix-id': req.headers.get('svix-id') || '',
    'svix-signature': req.headers.get('svix-signature') || '',
    'svix-timestamp': req.headers.get('svix-timestamp') || '',
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    return event; // Return the verified event
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return; // Explicitly return undefined on error
  }
};

const handleClerkWebhook = httpAction(async (_ctx, req) => {
  const event = await validatePayload(req);
  if (!event) {
    return new Response('Invalid webhook signature', { status: 400 });
  }

  // switch (event.type) {
  //   case 'user.created':
  //     const user = await _ctx.runQuery(internal.user.get, {
  //       clerkId: event.data.id,
  //     });

  //     if (user) {
  //       console.log(`Updating user ${event.data.id} with ${event.data}.`);
  //     }

  //   case 'user.updated':
  //     console.log('Creating/Updating User:', event.data.id);

  //     await _ctx.runMutation(internal.user.create, {
  //       username: `${event.data.first_name} ${event.data.last_name}`,
  //       imageUrl: event.data.image_url,
  //       clerkId: event.data.id,
  //       email: event.data.email_address[0].email_address,
  //     });

  //     break;
  //   default: {
  //     console.log('Clerk webhook event not supported', event.type);
  //     break;
  //   }
  // }
  switch (event.type) {
    case 'user.created':
      const user = await _ctx.runQuery(internal.user.get, {
        clerkId: event.data.id,
      });

      if (user) {
        console.log(`Updating user ${event.data.id} with ${event.data}.`);
        break; // Exit after updating
      }

      // If the user doesn't exist, create it
      console.log('Creating new user:', event.data.id);

    case 'user.updated':
      console.log('Creating/Updating User:', event.data.id);

      await _ctx.runMutation(internal.user.create, {
        username: `${event.data.first_name} ${event.data.last_name}`,
        imageUrl: event.data.image_url,
        clerkId: event.data.id,
        email: event.data.email_addresses[0].email_address,
      });

      break;
    default: {
      console.log('Clerk webhook event not supported', event.type);
      break;
    }
  }

  return new Response(null, { status: 200 });
  // Process the webhook event here
  console.log('Webhook event received:', event);
});

const http = httpRouter();
http.route({
  path: '/clerk-user-webhook',
  method: 'POST',
  handler: handleClerkWebhook,
});

export default http;
