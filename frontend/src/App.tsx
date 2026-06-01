import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'react/jsx-runtime';

export default function App() {
  return (
    <div>
      <h1>🎮 First Game Frontend Working!</h1>
      <p>If you can see this, React and Vite are running.</p>
    </div>
  );
}
