// test-utils.js
import React from 'react';
import { render } from '@testing-library/react';

// Custom render function that includes providers if needed
const customRender = (ui, options) => {
  return render(ui, { ...options });
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };