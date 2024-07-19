

export const mockLocalStorage = (localStorageMock) => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
};

export const setLocalStorageUser = (user) => {
  window.localStorage.setItem('user', JSON.stringify(user));
};

export const mockOnNavigate = () => jest.fn();

export const mockStore = (bills) => ({
  bills: jest.fn().mockReturnThis(),
  list: jest.fn().mockResolvedValue(bills),
});

export const mockStoreWithError = (error) => ({
  bills: jest.fn().mockReturnThis(),
  list: jest.fn().mockRejectedValue(new Error(error)),
});
