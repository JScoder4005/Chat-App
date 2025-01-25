'use client';

import { Card } from '@/components/ui/card';
import { useNavigation } from '@/hooks/useNavigation';

const DesktopNav = () => {
  const paths = useNavigation();
  return (
    <Card className="hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2">
      Nav
    </Card>
  );
};

export default DesktopNav;
