import store from "@/redux/store";
import AppRoutes from "@/routes/AppRoutes";
import { Provider } from "react-redux";
import { BrowserRouter, HashRouter } from "react-router";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </BrowserRouter>
  );
};

export default App;
