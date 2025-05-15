import { describe, it, expect, vi  } from "vitest";
import {render, fireEvent, screen, waitFor} from '@testing-library/react'
import ProfilePage from "@/pages/ProfilePage";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router";

vi.mock("./components/TypesComponent", () => ({
  default: ({ selectedTypes, onClear, onTypesChange, showChooseButton }: any) => (
    <div data-testid="types-component">
      {selectedTypes.map((type: string, index: number) => (
        <span key={index}>{type}</span>
      ))}
      {showChooseButton && (
        <>
          <button onClick={() => onTypesChange(['mockType'])}>Change</button>
          <button onClick={onClear}>Clear</button>
        </>
      )}
    </div>
  ),
}));

vi.mock("@/redux/slices/userSlice", () => ({
  getUserDetailsId: vi.fn(() => ({ type: "getUserDetailsId" })),
  updateUserDetails: vi.fn(() => () => Promise.resolve({ type: "updateUserDetails" })),
}));

vi.mock("@/redux/slices/authSlice", () => ({
  getEventsTypes: vi.fn(() => ({ type: "getEventsTypes" })),
}));

const mockStore = configureStore(); 

const mockUser = {
  id: "1",
  full_name: "John Doe",
  email: "john@example.com",
  phone_number: "123456789",
  location: "New York",
  sex: "Male",
  preferred_event_types: ["music", "tech"],
};

const initialState = {
  userDetails: {
    user: mockUser,
    loading: false,
    error: null,
  },
  auth: {
    user: { userId: "1" },
    eventTypes: ["music", "tech", "sports"],
    loading: false,
    error: null,
  },
};

const renderWithStore = (storeState = initialState) => {
  const store = mockStore(storeState);
  return render(
    <Provider store={store}>
			<MemoryRouter>
      	<ProfilePage />
			</MemoryRouter>
    </Provider>
  );
};

describe("ProfilePage", () => {
  it("renders profile data correctly", () => {
    renderWithStore();
    expect(screen.getByText("Profile Page")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("New York")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123456789")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    renderWithStore({
      ...initialState,
      userDetails: { ...initialState.userDetails, loading: true },
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows error state", () => {
    renderWithStore({
      ...initialState,
      userDetails: { ...initialState.userDetails, error: "Failed to fetch user" },
    });
    expect(screen.getByText("Failed to fetch user")).toBeInTheDocument();
  });

  it("toggles edit mode and updates values", async () => {
    renderWithStore();
    fireEvent.click(screen.getByText("Edit"));
    const nameInput = screen.getByDisplayValue("John Doe");
    fireEvent.change(nameInput, { target: { value: "Jane Smith" } });
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(nameInput).toHaveValue("Jane Smith");
    });
  });

  it("cancels edit mode and reverts changes", async () => {
    renderWithStore();
    fireEvent.click(screen.getByText("Edit"));
    const nameInput = screen.getByDisplayValue("John Doe");
    fireEvent.change(nameInput, { target: { value: "Changed Name" } });
    fireEvent.click(screen.getByText("Cancel"));
    expect(nameInput).toHaveValue("John Doe");
  });

  it("clears selected types through TypesComponent", () => {
    renderWithStore();
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Clear"));
    expect(screen.queryByText("music")).not.toBeInTheDocument();
  });

  it("changes selected types through TypesComponent", () => {
    renderWithStore();
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Change"));
    expect(screen.getByText("mockType")).toBeInTheDocument();
  });
});
