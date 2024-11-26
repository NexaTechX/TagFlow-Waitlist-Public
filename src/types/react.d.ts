import * as React from 'react';

declare module 'react' {
  interface ReactNode {
    children?: ReactNode | undefined;
  }
}

declare module 'react/jsx-runtime' {
  export default React;
} 