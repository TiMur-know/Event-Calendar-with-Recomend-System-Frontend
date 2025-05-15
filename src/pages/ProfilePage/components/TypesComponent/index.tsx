import ChoicePrefersModal from "@/components/ChoisePrefersModal";
import { useState } from "react";
import styles from "./styles.module.scss";

interface TypesComponentProps {
	allTypes: string[] | null;
	selectedTypes: string[];
	onTypesChange: (types: string[]) => void;
	onClear: () => void;
	showChooseButton: boolean; // New prop to control button visibility
}

const TypesComponent = ({ allTypes, selectedTypes, onTypesChange, onClear, showChooseButton }: TypesComponentProps) => {
	const [showModal, setShowModal] = useState(false);

	return (
		<div className={styles["container"]}>
			<h2>Selected types</h2>
			<div className={styles["container__content"]}>
				<div className={styles["container__types-section"]}>
					<div className={styles["container__types-container"]}>
						{selectedTypes.length > 0 && (
							<div className={styles["container__types"]}>
								{selectedTypes.map((type, index) => (
									<span key={index} className={styles["container__type"]}>
										{type}
									</span>
								))}
							</div>
						)}
					</div>
				</div>
				<div className={styles["container__buttons-section"]}>
					{showChooseButton && (
						<button
							className={styles["container__button--primary"]}
							onClick={() => setShowModal(true)}
						>
							Choose your types
						</button>
					)}
					{showChooseButton && (
						<button
							className={styles["container__button--primary"]}
							onClick={onClear}
						>
							Clear
						</button>
					)}
				</div>
			</div>
			{showModal && (
				<ChoicePrefersModal
					selectedTypes={selectedTypes}
					allTypesEvents={allTypes}
					onClose={() => setShowModal(false)}
					onConfirm={(types) => {
						onTypesChange(types);
						setShowModal(false);
					}}
				/>
			)}
		</div>
	);
};

export default TypesComponent;