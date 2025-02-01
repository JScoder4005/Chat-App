import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Id } from '@/convex/_generated/dataModel';
import { Check, User, X } from 'lucide-react';
import React from 'react';

type Props = {
  id: Id<'requests'>;
  imageUrl: string;
  username: string;
  email: string;
};
const Request = ({ id, email, imageUrl, username }: Props) => {
  return (
    <Card className="w-full flex flex-row p-2 items-center justify-between gap-2">
      <div className="flex items-center gap-4 truncate ">
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
          <div className="flex flex-col truncate">
            <h4 className="truncate">{username}</h4>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </Avatar>
      </div>
      <div className="flex items-center gap-2">
        <Button size={'icon'} onClick={() => {}}>
          <Check />
        </Button>
        <Button size={'icon'} variant="destructive" onClick={() => {}}>
          <X />
        </Button>
      </div>
    </Card>
  );
};

export default Request;
