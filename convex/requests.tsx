import { query } from './_generated/server';
import { getUserByClerkId } from './_utils';

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    const requests = await ctx.db
      .query('requests')
      .withIndex('by_receiver', (q) => q.eq('receiver', currentUser._id))
      .collect();

    const requestsWithSender = await Promise.all(
      requests.map(async (request) => {
        const sender = await ctx.db.get(request.sender);

        if (!sender) {
          throw new Error('Request Sender not found');
        }

        return { sender, request };
      })
    );

    return requestsWithSender;
  },
});

//to show the friend request notication information

export const count = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    const requests = await ctx.db
      .query('requests')
      .withIndex('by_receiver', (q) => q.eq('receiver', currentUser._id))
      .collect();

    return requests.length;
  },
});
