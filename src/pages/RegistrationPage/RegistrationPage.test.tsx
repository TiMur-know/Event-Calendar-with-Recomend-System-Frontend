import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import configureStore from 'redux-mock-store';
import RegistrationPage from './index';
import * as authSlice from '@/redux/slices/authSlice';

const mockStore = configureStore();

vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router');
	return {
		...actual,
		useNavigate: () => vi.fn(), 
	};
});

describe('RegistrationPage', () => {
	let store: ReturnType<typeof mockStore>;

	beforeEach(() => {
		store = mockStore({
			auth: {
				eventTypes: ['Music', 'Art'],
				loading: false,
			},
		});
	});

	it('renders registration form', () => {
		render(
			<Provider store={store}>
				<MemoryRouter>
					<RegistrationPage />
				</MemoryRouter>
			</Provider>
		);

		expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
		expect(screen.getByText('Choice Types')).toBeInTheDocument();
		expect(screen.getByText('Submit')).toBeInTheDocument();
	});

	it('validates empty form fields on submit', async () => {
		render(
			<Provider store={store}>
				<MemoryRouter>
					<RegistrationPage />
				</MemoryRouter>
			</Provider>
		);

		fireEvent.click(screen.getByText('Submit'));

		await waitFor(() => {
			expect(screen.getByText('First name is required')).toBeInTheDocument();
			expect(screen.getByText('Last name is required')).toBeInTheDocument();
			expect(screen.getByText('Email is required')).toBeInTheDocument();
			expect(screen.getByText('Password is required')).toBeInTheDocument();
			expect(screen.getByText('Confirm Password is required')).toBeInTheDocument();
		});
	});

	it('opens modal when "Choice Types" is clicked', () => {
		render(
			<Provider store={store}>
				<MemoryRouter>
					<RegistrationPage />
				</MemoryRouter>
			</Provider>
		);

		fireEvent.click(screen.getByText('Choice Types'));

		expect(screen.getByText('Confirm')).toBeInTheDocument(); 
	});

});
