import React from 'react';

type Props = React.PropsWithChildren<{}>;

const Layout = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default Layout;
