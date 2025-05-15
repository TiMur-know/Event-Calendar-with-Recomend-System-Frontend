import Layout_1 from "@/components/core/Layout_1";
import CalendarPage from "@/pages/CalendarPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";
import ProfilePage from "@/pages/ProfilePage";
import RegistrationPage from "@/pages/RegistrationPage";
import { Route, Routes } from "react-router";

const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/registration" element={<RegistrationPage />} />

			<Route path="/" element={<Layout_1><HomePage /></Layout_1>} />
			<Route path="/calendar" element={<Layout_1><CalendarPage /></Layout_1>} />
			<Route path="/profile" element={<Layout_1><ProfilePage /></Layout_1>} />
			<Route path="*" element={<Layout_1><NotFound /></Layout_1>} />
		</Routes>
	);
};

export default AppRoutes;
