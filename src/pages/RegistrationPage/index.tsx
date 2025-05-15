import image from '@/assets/intro.jpg';
import ChoisePrefersModal from '@/components/ChoisePrefersModal';
import { getEventsTypes, RegistrationUser, registrationUser } from '@/redux/slices/authSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import './styles.scss';

const RegistrationPage = () => {
	const dispatch: AppDispatch = useDispatch();
	const eventTypes = useSelector((state: RootState) => state.auth.eventTypes);
	const iLoading = useSelector((state: RootState) => state.auth.loading);
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [isModalShow, setIsModal] = useState(false);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [errors, setErrors] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		server: '',
		firstName: '', 
		lastName: '' 
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!eventTypes) {
			dispatch(getEventsTypes());
		}
	}, []);

	const onOpenModal = () => {
		setIsModal(true);
	};
	const onCloseModal = () => {
		setIsModal(false);
	};
	const onConfirm = (array: string[]) => {
		setSelectedTypes(array);
		onCloseModal();
	};

	const handleEmailKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			if (!email.match(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/)) {
				setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
			} else {
				setErrors((prev) => ({ ...prev, email: '' }));
			}
		}
	};

	const validateForm = () => {
		let isValid = true;
		const newErrors = { email: '', password: '', confirmPassword: '', server: '', firstName: '', lastName: '' }; 

		if (!firstName) {
			newErrors.firstName = 'First name is required'; 
			isValid = false;
		}

		if (!lastName) {
			newErrors.lastName = 'Last name is required'; 
			isValid = false;
		}

		if (!email) {
			newErrors.email = 'Email is required';
			isValid = false;
		}

		if (!password) {
			newErrors.password = 'Password is required';
			isValid = false;
		} else if (password.length < 8) {
			newErrors.password = 'Password must be at least 8 characters';
			isValid = false;
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = 'Confirm Password is required';
			isValid = false;
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleRegistration = async () => {
		setErrors({firstName:'', lastName:'', email: '', password: '', confirmPassword: '', server: '' });

		if (!validateForm()) {
			return;
		}
		const user: RegistrationUser = {
			email,
			fullname: `${firstName} ${lastName}`,
			password,
			prefferedTypes: selectedTypes
		};
		try {
			setIsLoading(true);
			await dispatch(registrationUser(user)).unwrap();
			if (!errors.server) {
				navigate('/login');
			}
		} catch (error: any) {
			setErrors((prev) => ({ ...prev, server: error }));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="registration-container">
			<div className="registration-image-container">
				<img src={image} alt="Registration Illustration" className="registration-image" />
			</div>
			<div className="registration-form-container">
				<h1 className="registration-title">Registration Page</h1>
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					onKeyPress={handleEmailKeyPress}
					className="registration-input"
				/>
				{errors.email && <p className="error-message">{errors.email}</p>}
				<div className='full-name-container'>
					<input
						type="text"
						name="firstName"
						placeholder="First Name"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						className="registration-input-cut"
					/>
					<input
						type="text"
						name="lastName"
						placeholder="Last Name"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						className="registration-input-cut"
					/>
				</div>
				{errors.lastName && <p className="error-message">{errors.lastName}</p>}
				{errors.firstName && <p className="error-message">{errors.firstName}</p>}
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="registration-input"
				/>
				{errors.password && <p className="error-message">{errors.password}</p>}
				<input
					type="password"
					name="confirmPassword"
					placeholder="Confirm Password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					className="registration-input"
				/>
				{errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
				{errors.server && <p className="error-message">{errors.server}</p>}
				{(iLoading || isLoading) && <p>Loading...</p>}
				<button onClick={onOpenModal} className="choice-button">Choice Types</button>
				<button onClick={handleRegistration} className="registration-button">Submit</button>

				<div>Have account? <Link to="/login">Login</Link></div>
				<div>Our policy: <Link to="/policy">Privacy & Policy</Link> </div>
			</div>
			{isModalShow ? (<ChoisePrefersModal selectedTypes={selectedTypes} allTypesEvents={eventTypes || []}
				onClose={onCloseModal} onConfirm={onConfirm} />) : (<></>)}
		</div>
	);
}
export default RegistrationPage;