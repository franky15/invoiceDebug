/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import '@testing-library/jest-dom/extend-expect';
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store.js";
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {

  describe("When I am on NewBill Page", () => {

    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: 'test@test.com'
      }));
      document.body.innerHTML = NewBillUI();

      store.bills = jest.fn().mockImplementation(() => ({
        create: jest.fn().mockResolvedValue({ fileUrl: 'https://localhost:3456/images/test.jpg', key: '1234' }),
        update: jest.fn().mockResolvedValue({})
      }));
    });

    afterEach(() => {
      console.error.mockRestore();
    });

    //Vérification si tous les éléments du formulaire de création de facture sont correctement rendus.
    test("Then NewBill form should be rendered correctly", () => {
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();  //vérification si l'élément est présent dans la page ou dom
      expect(screen.getByTestId("expense-type")).toBeTruthy();
      expect(screen.getByTestId("expense-name")).toBeTruthy();
      expect(screen.getByTestId("datepicker")).toBeTruthy();
      expect(screen.getByTestId("amount")).toBeTruthy();
      expect(screen.getByTestId("vat")).toBeTruthy();
      expect(screen.getByTestId("pct")).toBeTruthy();
      expect(screen.getByTestId("commentary")).toBeTruthy();
      expect(screen.getByTestId("file")).toBeTruthy();
      expect(screen.getByText("Envoyer")).toBeTruthy();
    });

    test("Then the form should submit correctly with valid data", async () => {
      const onNavigate = jest.fn();
      const newBill = new NewBill({ document, onNavigate, store: store, localStorage: window.localStorage });

      const form = screen.getByTestId("form-new-bill");  
      const expenseType = screen.getByTestId("expense-type");
      const expenseName = screen.getByTestId("expense-name");
      const datepicker = screen.getByTestId("datepicker");
      const amount = screen.getByTestId("amount");
      const vat = screen.getByTestId("vat");
      const pct = screen.getByTestId("pct");
      const commentary = screen.getByTestId("commentary");
      const file = screen.getByTestId("file");

      fireEvent.change(expenseType, { target: { value: "Transports" } }); 
      fireEvent.change(expenseName, { target: { value: "Vol Paris Londres" } });
      fireEvent.change(datepicker, { target: { value: "2022-03-01" } });
      fireEvent.change(amount, { target: { value: "348" } });
      fireEvent.change(vat, { target: { value: "70" } });
      fireEvent.change(pct, { target: { value: "20" } });
      fireEvent.change(commentary, { target: { value: "Voyage d'affaires" } });
      fireEvent.change(file, { target: { files: [new File(['file content'], 'test.png', { type: 'image/png' })] } });

      const handleSubmit = jest.fn(newBill.handleSubmit);
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      await waitFor(() => expect(handleSubmit).toHaveBeenCalled());
      await waitFor(() => expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills']));
    });

    test("Then the file input should accept files", () => {
      const fileInput = screen.getByTestId("file");
      const file = new File(['test'], 'test.png', { type: 'image/png' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(fileInput.files[0]).toStrictEqual(file);
      expect(fileInput.files).toHaveLength(1);
    });

    test("Then it should validate file input", async () => {
      const newBill = new NewBill({ document, onNavigate: jest.fn(), store: store, localStorage: window.localStorage });

      const fileInput = screen.getByTestId("file");
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      fileInput.addEventListener("change", handleChangeFile);

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => expect(handleChangeFile).toHaveBeenCalled());
    });

    /*
    test("Then it should handle API errors during file upload", async () => {
      store.bills().create.mockRejectedValueOnce(new Error("API Error"));

      const newBill = new NewBill({ document, onNavigate: jest.fn(), store, localStorage: window.localStorage });

      const fileInput = screen.getByTestId("file");
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      fileInput.addEventListener("change", handleChangeFile);

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => expect(handleChangeFile).toHaveBeenCalled());
      
      // Ajout d'un log pour vérifier si l'erreur est capturée
      console.log('Checking if console.error is called');
      
      await waitFor(() => expect(console.error).toHaveBeenCalledWith(expect.any(Error)));
      
      // Afficher le contenu des erreurs capturées
      const errorCalls = console.error.mock.calls;
      console.log('Error calls:', errorCalls);
    });
    */

    test("Then the handleSubmit function should be called", async () => {
      const onNavigate = jest.fn();
      const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage });

      const form = screen.getByTestId("form-new-bill");

      fireEvent.change(screen.getByTestId("expense-type"), { target: { value: "Transports" } });
      fireEvent.change(screen.getByTestId("expense-name"), { target: { value: "Vol Paris Londres" } });
      fireEvent.change(screen.getByTestId("datepicker"), { target: { value: "2022-03-01" } });
      fireEvent.change(screen.getByTestId("amount"), { target: { value: "348" } });
      fireEvent.change(screen.getByTestId("vat"), { target: { value: "70" } });
      fireEvent.change(screen.getByTestId("pct"), { target: { value: "20" } });
      fireEvent.change(screen.getByTestId("commentary"), { target: { value: "Voyage d'affaires" } });
      fireEvent.change(screen.getByTestId("file"), { target: { files: [new File(["file content"], "test.png", { type: "image/png" })] } });

      const handleSubmit = jest.spyOn(newBill, "handleSubmit");
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      await waitFor(() => expect(handleSubmit).toHaveBeenCalled());
    });
  });
});










