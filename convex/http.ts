import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { internal } from './_generated/api';

const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();

  //these are send by clerk
  // const svixHeaders = {
  //   'svid-id': req.headers.get('svid-id')!,
  //   'svix-signature': req.headers.get('svix-signature')!,
  //   'svix-timestamp': req.headers.get('svix-timestamp')!,
  // };

  const svixHeaders = {
    'svix-id': req.headers.get('svix-id')!,
    'svix-signature': req.headers.get('svix-signature')!,
    'svix-timestamp': req.headers.get('svix-timestamp')!,
  };

  console.log('Incoming headers:', svixHeaders);

  if (
    !svixHeaders['svix-id'] ||
    !svixHeaders['svix-signature'] ||
    !svixHeaders['svix-timestamp']
  ) {
    console.error('Missing required Svix headers');
    return undefined;
  }

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    return event;
  } catch (error) {
    console.error('Clerk webhook verification failed ', error);
  }
};

const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);
  if (!event) {
    return new Response('Could not validate clerk payload', { status: 400 });
  }

  switch (event.type) {
    case 'user.created':
      const user = await ctx.runQuery(internal.user.get, {
        clerkId: event.data.id,
      });

      if (user) {
        console.log(`Updating user ${event.data.id} with ${event.data}.`);
        break;
      }

    case 'user.updated': {
      console.log('Creating?Updating User:', event.data.id);

      await ctx.runMutation(internal.user.create, {
        username: `${event.data.first_name} ${event.data.last_name}`,
        imageUrl: event.data.image_url,
        clerkId: event.data.id,
        email: event.data.email_addresses[0].email_address,
      });
      break;
    }
    default: {
      console.log('Clerk webhook event not supported', event.type);
    }
  }

  return new Response(null, { status: 200 });
});

const http = httpRouter();

http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: handleClerkWebhook,
});

export default http;
