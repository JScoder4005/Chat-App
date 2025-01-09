import { httpRouter } from 'convex/server';

const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();
};

const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);
});

const http = httpRouter();

http.route({
  path: '/clerk-user-weebhook',
  method: 'POST',
  handler: handleClerkWebhook,
});
