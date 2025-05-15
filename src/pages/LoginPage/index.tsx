import image from '@/assets/intro.jpg';
import { login } from '@/redux/slices/authSlice';
import { AppDispatch, RootState } from "@/redux/store"; 
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import './styles.scss';

const LoginPage = () => {
	const navigate = useNavigate();
	const dispatch: AppDispatch = useDispatch();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const errorLogIn = useSelector((state: RootState) => state.auth.error);

	const validateForm = () => {
		const user = { email: email, password: password };

		if (user.password.length < 8) {
			return false;
		}

		return true;
	};

	const handleLogin = async () => {
		if (!email || !password) {
			setError('Please fill in all fields');
			return;
		}
		if (!validateForm()) {
			setError('Password must be at least 8 characters long');
			return;
		}
		setIsLoading(true); 
		try {
			const resultAction = await dispatch(login({ email, password }));
			if (login.fulfilled.match(resultAction)) {
				navigate('/');
			} else if (login.rejected.match(resultAction)) {
				setError(resultAction.payload as string || 'Login failed. Please check your credentials and try again.');
			}
		} catch (err) {
			setError('An unexpected error occurred. Please try again later.');
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="login-container">
			<div className="login-image-container">
				<img src={image} alt="Login Illustration" className="login-image" />
			</div>
			<div className="login-form-container">
				<h1 className="login-title">Login Page</h1>
				<input
					type="text"
					name="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="login-input"
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="login-input"
				/>
				<button onClick={handleLogin} className="login-button" disabled={isLoading}>
					{isLoading ? 'Loading...' : 'Submit'}
				</button>
				{error && <div className="error-message">{error}</div>}
				<div>Don`t have account? <Link to="/registration">Registration</Link></div>
				<div>Our policy: <Link to="/policy">Privacy & Policy</Link> </div>
			</div>
		</div>
	);
};

export default LoginPage;