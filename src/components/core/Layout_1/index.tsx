import React from 'react';
import Footer from './Footer';
import Header from './Header';

const Layout_1 = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="d-flex flex-column min-vh-100">
			<header>
				<Header />
			</header>
			<main className="flex-grow-1 ms-2 mt-3">
				{children}
			</main>
			<footer className="mt-auto">
				<Footer />
			</footer>
		</div>
	);
};

export default Layout_1;