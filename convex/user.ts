import { v } from 'convex/values';
import { internalMutation, internalQuery } from './_generated/server';

// export const create = internalMutation({
//   args: {
//     username: v.string(),
//     imageUrl: v.string(),
//     clerkId: v.string(),
//     email: v.string(),
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.insert('users', args);
//   },
// });

//querying the index as per the userId property by using by_clerkId property
// export const get = internalQuery({

//   args: { clerkId: v.string() },

//   async handler(ctx, args) {
//     return ctx.db
//       .query('users')
//       .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
//       .unique();
//   },
// });

export const create = internalMutation({
  args: {
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    console.log('Received arguments:', args);
    try {
      await ctx.db.insert('users', args);
      console.log('User successfully created:', args);
    } catch (error) {
      console.error('Error inserting user:', error);
    }
  },
});

export const get = internalQuery({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    console.log('Querying with clerkId:', args.clerkId);
    try {
      const user = await ctx.db
        .query('users')
        .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
        .unique();
      console.log('Queried user:', user);
      return user;
    } catch (error) {
      console.error('Error querying user:', error);
    }
  },
});
