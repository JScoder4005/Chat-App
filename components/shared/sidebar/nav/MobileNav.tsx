'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme/theme-toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useConversation } from '@/hooks/useConversation';
import { useNavigation } from '@/hooks/useNavigation';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const MobileNav = () => {
  const paths = useNavigation();

  const { isActive } = useConversation();

  if (isActive) return null;
  return (
    // <Card className="fixed bottom-4 w-[calc(100vh-32px)] flex items-center h-16 p-2 lg:hidden">
    //   <nav className="w-full">
    //     <ul className="flex  items-center justify-evenly">
    //       {paths.map((path, id) => {
    //         return (
    //           <li key={id} className="relative">
    //             <Link href={path.href}>
    //               <Tooltip>
    //                 <TooltipTrigger>
    //                   <Button
    //                     size={'icon'}
    //                     variant={path.active ? 'default' : 'outline'}
    //                   >
    //                     {path.icon}
    //                   </Button>
    //                 </TooltipTrigger>
    //                 <TooltipContent>
    //                   <p>{path.name}</p>
    //                 </TooltipContent>
    //               </Tooltip>
    //             </Link>
    //           </li>
    //         );
    //       })}
    //       <li>
    //         <ThemeToggle />
    //       </li>
    //       <li>
    //         <UserButton />
    //       </li>
    //     </ul>
    //   </nav>
    // </Card>

    <Card className="fixed bottom-4 w-[calc(100vw-32px)] flex items-center h-16 p-2 lg:hidden overflow-visible z-50">
      <nav className="w-full">
        <ul className="flex items-center justify-between space-x-4">
          {paths.map((path, id) => (
            <li key={id} className="relative">
              <Link href={path.href} suppressHydrationWarning>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={'icon'}
                      variant={path.active ? 'default' : 'outline'}
                      suppressHydrationWarning
                    >
                      {path.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{path.name}</p>
                  </TooltipContent>
                </Tooltip>
              </Link>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
          <li>
            <UserButton
              appearance={{ elements: { userButtonAvatarBox: 'w-8 h-8' } }}
            />
          </li>
        </ul>
      </nav>
    </Card>
  );
};

export default MobileNav;
