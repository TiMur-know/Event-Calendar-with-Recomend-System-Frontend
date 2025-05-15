import { render, screen } from '@testing-library/react';
import AuthElementCheck from '@/hocs/AuthElementCheck';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, it, expect, afterEach } from 'vitest';
import Cookies from 'js-cookie';

vi.mock('js-cookie', () => ({
default: {
get: vi.fn()
}
}));

const renderWithStore = (user: any, setRoles?: string[]) => {
const store = configureStore({
reducer: {
auth: () => ({ user })
}
});

return render(
<Provider store={store}>
<AuthElementCheck setRoles={setRoles}>
<div>Protected Content</div>
</AuthElementCheck>
</Provider>
);
};

describe('AuthElementCheck', () => {
afterEach(() => {
vi.clearAllMocks();
});

it('renders children when user role matches setRoles', () => {
renderWithStore({ role: 'admin' }, ['admin', 'editor']);
expect(screen.getByText('Protected Content')).toBeInTheDocument();
});

it('does not render children when user role does not match setRoles', () => {
renderWithStore({ role: 'guest' }, ['admin', 'editor']);
expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
});

it('renders children when no setRoles are defined and role is null', () => {
renderWithStore({ role: null }, []);
expect(screen.getByText('Protected Content')).toBeInTheDocument();
});

it('uses cookie role if Redux user is undefined', () => {
(Cookies.get as any).mockReturnValue('admin');
renderWithStore(undefined, ['admin']);
expect(screen.getByText('Protected Content')).toBeInTheDocument();
});

it('does not render children if cookie role is not in setRoles', () => {
(Cookies.get as any).mockReturnValue('guest');
renderWithStore(undefined, ['admin']);
expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
});
});