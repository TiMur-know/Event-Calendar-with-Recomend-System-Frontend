import React from 'react';
import styles from './styles.module.scss';

interface ButtonPlaceProps {
	onCreate: () => void;
}

const ButtonPlace: React.FC<ButtonPlaceProps> = ({ onCreate }) => {
	return (
		<div className={styles['button-container']}>
			<button className={styles.button} onClick={onCreate}>Add Event</button>
		</div>
	);
}

export default ButtonPlace;