export const fetchGetUserDetails = async (userId:string) => {
	const response = await fetch("data/usersDetails/");
	if (!response.ok) {
		throw new Error("Failed to fetch user details");
	}

	const data = await response.json();
	const user = data.find((user) => user.Id === userId);
	if (!user) {
		throw new Error("User not found");
	}

	return user;
};
