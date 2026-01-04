import React from 'react';
import {Provider} from 'jotai'
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      {children}
    </Provider>
  );
};

export default Layout;