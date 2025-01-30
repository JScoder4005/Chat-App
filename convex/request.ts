// import { ConvexError, v } from 'convex/values';
// import { mutation } from './_generated/server';
// import { getUserByClerkId } from './_utils';

// export const create = mutation({
//   args: {
//     email: v.string(),
//   },

//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();

//     if (!identity) {
//       throw new ConvexError('Unauthorized');
//     }

//     if (args.email === identity.email) {
//       throw new ConvexError('Cannot send request to self');
//     }

//     const currentUser = await getUserByClerkId({
//       ctx,
//       clerkId: identity.subject,
//     });

//     if (!currentUser) {
//       throw new ConvexError('User not found');
//     }

//     const receiver = await ctx.db
//       .query('users')
//       .withIndex('by_email', (q) => q.eq('email', args.email))
//       .unique();

//     if (!receiver) {
//       throw new ConvexError('User could not found');
//     }

//     const requestAlreadySent = await ctx.db
//       .query('requests')
//       .withIndex('by_receiver_sender', (q) =>
//         q.eq('receiver', receiver._id).eq('sender', currentUser._id)
//       )
//       .unique();

//     if (requestAlreadySent) {
//       throw new ConvexError('Request already sent');
//     }

//     const requestAlreadyReceived = await ctx.db
//       .query('requests')
//       .withIndex('by_receiver_sender', (q) =>
//         q.eq('receiver', currentUser._id).eq('sender', receiver._id)
//       )
//       .unique();

//     if (requestAlreadyReceived) {
//       throw new ConvexError('This user has already sent you a request ');
//     }

//     const request = await ctx.db.insert('requests', {
//       sender: currentUser._id,
//       receiver: receiver._id,
//     });

//     return request;
//   },
// });

import { ConvexError, v } from 'convex/values';
import { mutation } from './_generated/server';
import { getUserByClerkId } from './_utils';

export const create = mutation({
  args: {
    email: v.string(),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    if (args.email === identity.email) {
      throw new ConvexError('Cannot send request to self');
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    // First check if there are multiple users with the same email
    const receivers = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .collect();

    if (receivers.length === 0) {
      throw new ConvexError('User could not be found');
    }

    if (receivers.length > 1) {
      throw new ConvexError('Multiple users found with this email');
    }

    const receiver = receivers[0];

    const requestAlreadySent = await ctx.db
      .query('requests')
      .withIndex('by_receiver_sender', (q) =>
        q.eq('receiver', receiver._id).eq('sender', currentUser._id)
      )
      .unique();

    if (requestAlreadySent) {
      throw new ConvexError('Request already sent');
    }

    const requestAlreadyReceived = await ctx.db
      .query('requests')
      .withIndex('by_receiver_sender', (q) =>
        q.eq('receiver', currentUser._id).eq('sender', receiver._id)
      )
      .unique();

    if (requestAlreadyReceived) {
      throw new ConvexError('This user has already sent you a request');
    }

    const request = await ctx.db.insert('requests', {
      sender: currentUser._id,
      receiver: receiver._id,
    });

    return request;
  },
});
