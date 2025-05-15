import { getEventsTypes } from "@/redux/slices/authSlice";
import { getUserDetailsId, updateUserDetails } from "@/redux/slices/userSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import TypesComponent from "./components/TypesComponent";
import styles from "./styles.module.scss";


const ProfilePage = () => {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate()
	const state = useSelector((state: RootState) => state);
	const { user, loading: userLoading, error: userError } = useSelector((state: RootState) => state.userDetails);
	const userId = useSelector((state: RootState) => state.auth.user?.userId);
	const { eventTypes, loading: eventLoading, error: eventError } = useSelector((state: RootState) => state.auth);
	const sexList = {
		Male: "Male",
		Female: "Female",
		Other: "Other",
		NONE: "None",
	};
	const isLoading = userLoading || eventLoading;
	const isError = userError || eventError;
	const [selectedTypes, setSelectedTypes] = useState<string[]>(user?.preferred_event_types || []);
	const [userComp, setUserComp] = useState({
		id: user?.id || "",
		full_name: user?.full_name || "",
		email: user?.email || "",
		phone_number: user?.phone_number || "",
		location: user?.location || "",
		sex: user?.sex || "",
	});
	const [isEditMode, setIsEditMode] = useState(false);

	const toggleEditMode = () => {
		setIsEditMode(!isEditMode);
		if (!isEditMode) {
			handleCancel(); // Reset fields when switching to "Show" mode
		}
	};

	useEffect(() => {
		if (userId !== null && userId !== undefined) {
			dispatch(getUserDetailsId(userId!));
		}

	}, [userId, dispatch]);
	useEffect(() => {
		dispatch(getEventsTypes())
	}, [dispatch])
	useEffect(() => {
		if (user) {
			setUserComp({
				id: user.id || "",
				full_name: user.full_name || "",
				email: user.email || "",
				phone_number: user.phone_number || "",
				location: user.location || "",
				sex: user.sex || "",
			});
			setSelectedTypes(user.preferred_event_types || []);
		}
	}, [user]);

	const validateInputs = () => {
		return true
	}
	const handleSave = () => {
		if (!validateInputs()) {
			return;
		}

		try {
			const updatedUser = {
				...userComp,
				id: userComp.id,
				sex: userComp.sex !== "NONE" ? userComp.sex : "",
				preferred_event_types: selectedTypes,
			};
			dispatch(updateUserDetails(updatedUser))
				.then(() => {
					if (userId) {
						dispatch(getUserDetailsId(userId));
						setIsEditMode(false); // Switch to "Show" mode after saving
					}
				});
		} catch (err) {
			console.error("Error", err);
		}
	};
	const handleCancel = () => {
		setUserComp({
			...userComp,
			full_name: user?.full_name || "",
			email: user?.email || "",
			phone_number: user?.phone_number || "",
			location: user?.location || "",
			sex: user?.sex || ""
		})
	};
	const changeImage = () => {

	};

	return (
		<div className={styles["profile-page"]}>
			<h1 className={styles["profile-page__title"]}>Profile Page</h1>
			{isLoading ? (
				<p>Loading...</p>
			) : isError ? (
				<p className={styles["profile-page__error"]}>{isError}</p>
			) : (
				<>
					<div className={styles["profile-page__image-container"]}>

					</div>
					<div className={styles["profile-form"]}>
						<div className={styles["profile-form__field"]}>
							<label className={styles["profile-form__field__label"]}>Full Name</label>
							<input
								className={styles["profile-form__field__input"]}
								type="text"
								value={userComp?.full_name || ""}
								onChange={(e) => { setUserComp({ ...userComp, full_name: e.target.value }) }}
								disabled={!isEditMode}
							/>
						</div>
						<div className={styles["profile-form__field"]}>
							<label className={styles["profile-form__field__label"]}>Sex</label>
							<select
								className={styles["profile-form__field__input"]}
								value={userComp?.sex || ""}
								onChange={(e) => { setUserComp({ ...userComp, sex: e.target.value }) }}
								disabled={!isEditMode}
							>
								<option value="" disabled>Select your sex</option>
								{Object.entries(sexList).map(([key, value]) => (
									<option key={key} value={key}>{value}</option>
								))}
							</select>
						</div>
						<div className={styles["profile-form__field"]}>
							<label className={styles["profile-form__field__label"]}>Location</label>
							<input
								className={styles["profile-form__field__input"]}
								type="text"
								value={userComp?.location || ""}
								onChange={(e) => { setUserComp({ ...userComp, location: e.target.value }) }}
								disabled={!isEditMode}
							/>
						</div>
						<div className={styles["profile-form__field"]}>
							<label className={styles["profile-form__field__label"]}>Phone Number</label>
							<input
								className={styles["profile-form__field__input"]}
								type="tel"
								value={userComp?.phone_number || ""}
								onChange={(e) => { setUserComp({ ...userComp, phone_number: e.target.value }) }}
								disabled={!isEditMode}
							/>
						</div>
						<TypesComponent
							selectedTypes={selectedTypes}
							allTypes={eventTypes}
							onTypesChange={setSelectedTypes}
							onClear={() => setSelectedTypes([])}
							showChooseButton={isEditMode} 
						/>
						{isEditMode ? (
							<>
								<button
									className={styles["profile-form__button"]}
									onClick={handleSave}
								>
									Save
								</button>
								<button
									className={styles["profile-form__button"]}
									onClick={handleCancel}
								>
									Cancel
								</button>
							</>
						) : (
							<button
								className={styles["profile-form__button"]}
								onClick={toggleEditMode}
							>
								Edit
							</button>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default ProfilePage;