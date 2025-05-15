import { render, screen, waitFor } from '@testing-library/react';
import AuthCheckerHOC from '@/hocs/AuthCheckerHOC';
import Cookies from 'js-cookie';
import { vi, describe, it, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router';

vi.mock('js-cookie', () => ({
	default: {
		get: vi.fn(),
	},
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe('AuthCheckerHOC', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('renders children when token matches serverToken', async () => {
		(Cookies.get as any).mockImplementation((key: string) =>
			key === 'token' ? 'same-token' : undefined
		);
		render(
			<MemoryRouter>
				<AuthCheckerHOC>
					<div>Protected Content</div>
				</AuthCheckerHOC>
			</MemoryRouter>
		);
		await waitFor(() => {
			expect(screen.getByText('Protected Content')).toBeInTheDocument();
			expect(mockNavigate).not.toHaveBeenCalled();
		});
	});

	it('navigates away when token does not match serverToken', async () => {
		(Cookies.get as any).mockImplementation((key: string) =>
			key === 'token' ? 'client-token' : undefined
		);

		const originalGet = Cookies.get;
		(Cookies.get as any).mockImplementationOnce((key: string) =>
			key === 'token' ? 'server-token' : undefined
		);

		render(
			<MemoryRouter>
				<AuthCheckerHOC>
					<div>Protected Content</div>
				</AuthCheckerHOC>
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/');
		});
	});
});