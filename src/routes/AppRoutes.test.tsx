import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import AppRoutes from './AppRoutes';
import { vi, describe, it, expect } from 'vitest';

vi.mock('@/pages/LoginPage', () => ({
default: () => <div>Login Page</div>
}));
vi.mock('@/pages/RegistrationPage', () => ({
default: () => <div>Registration Page</div>
}));
vi.mock('@/pages/HomePage', () => ({
default: () => <div>Home Page</div>
}));
vi.mock('@/pages/CalendarPage', () => ({
default: () => <div>Calendar Page</div>
}));
vi.mock('@/pages/ProfilePage', () => ({
default: () => <div>Profile Page</div>
}));
vi.mock('@/pages/NotFound', () => ({
default: () => <div>Not Found</div>
}));
vi.mock('@/components/core/Layout_1', () => ({
default: ({ children }:any) => <div>Layout: {children}</div>
}));

describe('AppRoutes', () => {
it('renders LoginPage at /login', () => {
render(
<MemoryRouter initialEntries={['/login']}>
<AppRoutes />
</MemoryRouter>
);
expect(screen.getByText('Login Page')).toBeInTheDocument();
});

it('renders RegistrationPage at /registration', () => {
render(
<MemoryRouter initialEntries={['/registration']}>
<AppRoutes />
</MemoryRouter>
);
expect(screen.getByText('Registration Page')).toBeInTheDocument();
});

it('renders HomePage at /', () => {
render(
<MemoryRouter initialEntries={['/']}>
<AppRoutes />
</MemoryRouter>
);
expect(screen.getByText('Layout:')).toBeInTheDocument();
expect(screen.getByText('Home Page')).toBeInTheDocument();
});

it('renders CalendarPage at /calendar', () => {
render(
<MemoryRouter initialEntries={['/calendar']}>
<AppRoutes />
</MemoryRouter>
);
expect(screen.getByText('Layout:')).toBeInTheDocument();
expect(screen.getByText('Calendar Page')).toBeInTheDocument();
});

it('renders ProfilePage at /profile', () => {
render(
<MemoryRouter initialEntries={['/profile']}>
<AppRoutes />
</MemoryRouter>
);
expect(screen.getByText('Layout:')).toBeInTheDocument();
expect(screen.getByText('Profile Page')).toBeInTheDocument();
});

it('renders NotFound for unknown route', () => {
render(
<MemoryRouter initialEntries={['/unknown']}>
<AppRoutes />
</MemoryRouter>
);
expect(screen.getByText('Layout:')).toBeInTheDocument();
expect(screen.getByText('Not Found')).toBeInTheDocument();
});
});