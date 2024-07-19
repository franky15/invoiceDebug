
export const mockConsoleError = () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  };
  
  export const restoreConsoleError = () => {
    console.error.mockRestore();
  };
  
  export const mockLocalStorage = (localStorageMock) => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  };
  
  export const setLocalStorageUser = (user) => {
    window.localStorage.setItem('user', JSON.stringify(user));
  };
  
  export const mockStoreBills = () => {
    return jest.fn().mockImplementation(() => ({
      create: jest.fn().mockResolvedValue({ fileUrl: 'https://localhost:3456/images/test.jpg', key: '1234' }),
      update: jest.fn().mockResolvedValue({})
    }));
  };
  
  export const mockOnNavigate = () => jest.fn();
  
  export const mockHandleSubmit = (newBill) => jest.fn(newBill.handleSubmit);
  
  export const mockHandleChangeFile = (newBill) => jest.fn(newBill.handleChangeFile);
  