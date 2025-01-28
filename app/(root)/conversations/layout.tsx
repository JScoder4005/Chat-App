import ItemList from '@/components/shared/item-list/ItemList';
import React from 'react';

type Props = React.PropsWithChildren<{}>;

const Layout = ({ children }: Props) => {
  return (
    <>
      <ItemList title="Conversations">Conversations page</ItemList>
      {children}
    </>
  );
};

export default Layout;
