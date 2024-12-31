import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';
import { usePathname, useRouter } from 'next/navigation';

describe('Header Component', () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  it('renders the logo and navigates to the home page on click', () => {
    render(<Header />);
    const logoButton = screen.getByText(/Coin \./i);
    expect(logoButton).toBeInTheDocument();

    fireEvent.click(logoButton);
    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });

  it('renders "Log In" button when the user is not logged in', () => {
    localStorage.removeItem('accessToken');
    render(<Header />);

    const loginButton = screen.getByText('Log In');
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);
    expect(mockRouterPush).toHaveBeenCalledWith('/login');
  });

  it('does not render "Log In" button when the pathname is "/login" and user is not logged in', () => {
    (usePathname as jest.Mock).mockReturnValue('/login');
    localStorage.removeItem('accessToken');
    render(<Header />);
    expect(screen.queryByText('Log In')).not.toBeInTheDocument();
  });

  it('renders ButtonsMenu when the pathname is "/login", and the user is logged in', () => {
    (usePathname as jest.Mock).mockReturnValue('/login');
    localStorage.setItem('accessToken', '123456');
    render(<Header />);
    expect(screen.getByText('Accounts')).toBeInTheDocument();
  });
});
