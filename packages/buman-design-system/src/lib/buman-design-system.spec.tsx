import { render } from '@testing-library/react';

import BumanDesignSystem from './buman-design-system';

describe('BumanDesignSystem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BumanDesignSystem />);
    expect(baseElement).toBeTruthy();
  });
});
