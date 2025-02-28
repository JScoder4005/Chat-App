import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutationState } from '@/hooks/useMutationState';
import { ConvexError } from 'convex/values';
import { Check, User, X } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

type Props = {
  id: Id<'requests'>;
  imageUrl: string;
  username: string;
  email: string;
};

const Request = ({ id, email, imageUrl, username }: Props) => {
  const { mutate: denyRequest, pending: denypending } = useMutationState(
    api.request.deny
  );
  const { mutate: acceptRequest, pending: acceptpending } = useMutationState(
    api.request.accept
  );

  return (
    <Card className="w-full flex flex-row p-2 items-center justify-between gap-2">
      <div className="flex items-center gap-4 truncate">
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate font-medium">{username}</h4>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          disabled={denypending || acceptpending}
          onClick={() => {
            acceptRequest({ id })
              .then(() => {
                toast.success('Friend request accepted!');
              })
              .catch((error) => {
                toast.error(
                  error instanceof ConvexError
                    ? error.data
                    : 'Unexpected error occurred'
                );
              });
          }}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          disabled={denypending || acceptpending}
          variant="destructive"
          onClick={() => {
            denyRequest({ id })
              .then(() => {
                toast.success('Friend request denied!');
              })
              .catch((error) => {
                toast.error(
                  error instanceof ConvexError
                    ? error.data
                    : 'Unexpected error occurred'
                );
              });
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default Request;
