/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import '@testing-library/jest-dom/extend-expect';
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";
import { mockLocalStorage, setLocalStorageUser, mockOnNavigate, mockStore, mockStoreWithError } from "../__mocks__/myMocksBills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    test("Then bill icon in vertical layout should be highlighted", async () => {
      mockLocalStorage(localStorageMock);
      setLocalStorageUser({ type: "Employee" });

      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);

      router();
      window.onNavigate(ROUTES_PATH.Bills);

      await waitFor(() => screen.getByTestId("icon-window"));

      const windowIcon = screen.getByTestId("icon-window");
      expect(windowIcon).toBeTruthy();
      expect(windowIcon).toHaveClass("active-icon");
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });

      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);

      const sortedDates = [...dates].sort((a, b) => (new Date(a) - new Date(b)));

      expect(dates).toEqual(sortedDates);
    });

    test("Then the 'New Bill' button should be clickable and navigate to the new bill page", () => {
      document.body.innerHTML = BillsUI({ data: bills });

      const onNavigateMock = mockOnNavigate();

      const billsPage = new Bills({
        document,
        onNavigate: onNavigateMock,
        store: null,
        localStorage: window.localStorage,
      });

      const buttonNewBill = screen.getByTestId("btn-new-bill");

      fireEvent.click(buttonNewBill);

      expect(onNavigateMock).toHaveBeenCalledWith(ROUTES_PATH['NewBill']);
    });

    test("Then a modal should open when clicking on the eye icon", async () => {
      document.body.innerHTML = BillsUI({ data: bills });

      const billsPage = new Bills({
        document,
        onNavigate: jest.fn(),
        store: null,
        localStorage: null,
      });

      const iconEyes = screen.getAllByTestId("icon-eye");

      iconEyes.forEach(iconEye => {
        iconEye.addEventListener("click", (e) => billsPage.handleClickIconEye(iconEye));
      });

      fireEvent.click(iconEyes[0]);

      await waitFor(() => {
        const modal = document.getElementById("modaleFile");
        expect(modal).toHaveClass("show");

        const img = modal.querySelector("img");
        expect(img).toBeTruthy();
      });
    });

    test("getBills should fetch from the mock API", async () => {
      const mockedStore = mockStore(bills);

      const billsPage = new Bills({
        document,
        onNavigate: jest.fn(),
        store: mockedStore,
        localStorage: window.localStorage,
      });

      const fetchedBills = await billsPage.getBills();

      expect(mockedStore.bills).toHaveBeenCalled();
      expect(mockedStore.list).toHaveBeenCalled();
      expect(fetchedBills).toEqual(bills);
    });

    test("getBills should handle API error 400", async () => {
      const mockedStore = mockStoreWithError("Erreur 400");

      const billsPage = new Bills({
        document,
        onNavigate: jest.fn(),
        store: mockedStore,
        localStorage: window.localStorage,
      });

      document.body.innerHTML = BillsUI({ data: [] });
      
      await billsPage.getBills().catch(e => expect(e.message).toBe("Erreur 400"));
      
      const message = screen.getByText(/Erreur 400/);
      expect(message).toBeTruthy();
    });

    test("getBills should handle API error 500", async () => {
      const mockedStore = mockStoreWithError("Erreur 500");

      const billsPage = new Bills({
        document,
        onNavigate: jest.fn(),
        store: mockedStore,
        localStorage: window.localStorage,
      });

      document.body.innerHTML = BillsUI({ data: [] });
      
      await billsPage.getBills().catch(e => expect(e.message).toBe("Erreur 500"));
      
      const message = screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });

  });
});
