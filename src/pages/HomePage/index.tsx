import React from 'react';
import About from './components/About';

const HomePage: React.FC = () => {
	return (
		<div>
			<h1>Welcome to the Calendar App</h1>
			<About />
		</div>
	);
};

export default HomePage;