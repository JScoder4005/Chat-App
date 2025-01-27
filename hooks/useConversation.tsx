import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useConversation = () => {
  const params = useParams();

  const conversationId = useMemo(
    () => params?.conversationId || ('' as string),
    [params?.conversationId]
  );

  // two !! converts the conversation into boolean
  const isActive = useMemo(() => !!conversationId, [conversationId]);

  return { conversationId, isActive };
};
