import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ButtonsMenu from '../ButtonsMenu';
import { usePathname, useRouter } from 'next/navigation';

jest.mock('@/utils/utils', () => ({
  checkToken: jest.fn(),
}));

describe('ButtonsMenu Component', () => {
  const mockRouterPush = jest.fn();
  const mockCheckToken = jest.requireMock('@/utils/utils').checkToken;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (usePathname as jest.Mock).mockReturnValue('/accounts');
  });

  it('renders all buttons', () => {
    render(<ButtonsMenu />);

    expect(screen.getByText('ATMs')).toBeInTheDocument();
    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(screen.getByText('Currency')).toBeInTheDocument();
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });

  it('triggers checkToken when clicking on Accounts', async () => {
    render(<ButtonsMenu />);
    const user = userEvent.setup();

    const atmsButton = screen.getByText('Accounts');
    await user.click(atmsButton);

    expect(mockCheckToken).toHaveBeenCalledWith(expect.any(Object), '/accounts');
  });

  it('navigates to login on logout', async () => {
    render(<ButtonsMenu />);
    const user = userEvent.setup();

    const logoutButton = screen.getByText('Log Out');
    await user.click(logoutButton);

    expect(mockRouterPush).toHaveBeenCalledWith('/login');
  });
});
