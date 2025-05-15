import { useState } from "react";
import "./ChoisePrefersModal.scss";

interface ChoicePrefersModalProps {
	selectedTypes: string[];
	allTypesEvents: string[]|null; 
	onClose: () => void;
	onConfirm: (selectedTypes: string[]) => void; 
}

const ChoicePrefersModal = ({ selectedTypes, allTypesEvents, onClose, onConfirm }: ChoicePrefersModalProps) => {
	const [SelectedTypes, setSelectedTypes] = useState(selectedTypes);

	const onTypeClick = (type: string) => {
		const isSelected = SelectedTypes.includes(type);
		if (isSelected) {
			setSelectedTypes(SelectedTypes.filter((t) => t !== type));
		} else {
			setSelectedTypes([...SelectedTypes, type]);
		}
	};
	const firstLetterUpperCase = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	}
	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<h2>Choose Your Preference</h2>
				<div className="types-container">
					{!allTypesEvents || allTypesEvents.length === 0 ? (
						<p>No types available to select.</p>
					) : (
						allTypesEvents.map((type) => (
							<div
								key={type}
								className={SelectedTypes.includes(type) ? "type-item-active" : "type-item-unactive"}
								onClick={() => onTypeClick(type)}
							>
								{firstLetterUpperCase(type)}
							</div>
						))
					)}
				</div>
				<div className="modal-actions">
					<button className="btn btn-primary" onClick={() => onConfirm(SelectedTypes)}>Confirm</button>
					<button className="btn btn-secondary" onClick={onClose}>Cancel</button>
				</div>
			</div>
		</div>
	);
};

export default ChoicePrefersModal;