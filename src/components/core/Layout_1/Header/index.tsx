import { Link, useLocation } from 'react-router';
import './styles.module.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useDispatch, useSelector } from 'react-redux';

import AuthElementCheck from '@/hocs/AuthElementCheck';
import { logout } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';

const Header = () => {
	const location = useLocation();
	const currentPath = location.pathname;
	const dispatch=useDispatch()
	const user = useSelector((state: RootState) => state.auth.user)

	const logOut=()=>{
		dispatch(logout())
	}
	return (
		<nav className="navbar navbar-expand-lg custom-navbar">
			<div className="container-fluid">
				<a className="navbar-brand text-primary " href="/">Calendar App</a>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<Link className={`nav-link custom-nav-link ${currentPath === '/' ? 'active text-primary text-decoration-underline' : ''}`} to="/">Home</Link>
						</li>
						<li className="nav-item">
							<Link className={`nav-link custom-nav-link ${currentPath === '/calendar' ? 'active text-primary text-decoration-underline' : ''}`} to="/calendar">Calendar</Link>
						</li>
					</ul>
					<ul className="navbar-nav">
						<li className="nav-item">
							<AuthElementCheck setRoles={['USER', 'ADMIN']}>
								<Link className="nav-link custom-nav-link" to="/profile">{user?.fullname}</Link>
								<Link className="nav-link custom-nav-link" to="/login" onClick={logOut}>Log Out</Link>
							</AuthElementCheck>
							<AuthElementCheck>
								<a className="nav-link custom-nav-link" href="/login">Login</a>
							</AuthElementCheck>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Header;
