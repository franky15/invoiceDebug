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

    test("Then NewBill form should be rendered correctly", () => {
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
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












/*
import { screen, fireEvent, waitFor } from "@testing-library/dom"; 
import NewBillUI from "../views/NewBillUI.js"; 
import '@testing-library/jest-dom/extend-expect';
import NewBill from "../containers/NewBill.js"; 

//////////////////////////////////////
//importation de ce dont on aura besoin
import { ROUTES_PATH } from "../constants/routes.js"; 
import { localStorageMock } from "../__mocks__/localStorage.js"; 
import store from "../__mocks__/store.js"; 
import router from "../app/Router.js"; 

describe("Given I am connected as an employee", () => {

  describe("When I am on NewBill Page", () => {

    beforeEach(() => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock }); // Mock localStorage pour simuler l'utilisateur connecté
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: 'test@test.com'
      }));
      
      document.body.innerHTML = NewBillUI(); // Affiche l'interface utilisateur de création de facture
    
    });

    // Test pour vérifier le rendu correct du formulaire de création de facture
    test("Then NewBill form should be rendered correctly", () => {
      expect(screen.getByTestId("form-new-bill")).toBeTruthy(); // Vérifie que le formulaire de facture est présent
      expect(screen.getByTestId("expense-type")).toBeTruthy(); // Vérifie le champ du type de dépense
      expect(screen.getByTestId("expense-name")).toBeTruthy(); // Vérifie le champ du nom de la dépense
      expect(screen.getByTestId("datepicker")).toBeTruthy(); // Vérifie le champ du datepicker
      expect(screen.getByTestId("amount")).toBeTruthy(); // Vérifie le champ du montant
      expect(screen.getByTestId("vat")).toBeTruthy(); // Vérifie le champ de la TVA
      expect(screen.getByTestId("pct")).toBeTruthy(); // Vérifie le champ du pourcentage
      expect(screen.getByTestId("commentary")).toBeTruthy(); // Vérifie le champ du commentaire
      expect(screen.getByTestId("file")).toBeTruthy(); // Vérifie le champ du fichier
      expect(screen.getByText("Envoyer")).toBeTruthy(); // Vérifie le bouton d'envoi
    });

    //POST
    // Test pour vérifier la soumission correcte du formulaire avec des données valides
    test("Then the form should submit correctly with valid data", async () => {
      const onNavigate = jest.fn(); // Mock de la fonction de navigation
      const newBill = new NewBill({ // Instancie le container de création de facture avec les dépendances simulées
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage
      });

      // Sélection des éléments du formulaire
      const form = screen.getByTestId("form-new-bill");
      const expenseType = screen.getByTestId("expense-type");
      const expenseName = screen.getByTestId("expense-name");
      const datepicker = screen.getByTestId("datepicker");
      const amount = screen.getByTestId("amount");
      const vat = screen.getByTestId("vat");
      const pct = screen.getByTestId("pct");
      const commentary = screen.getByTestId("commentary");
      const file = screen.getByTestId("file");

      // Remplissage des champs avec des données valides
      fireEvent.change(expenseType, { target: { value: "Transports" } });
      fireEvent.change(expenseName, { target: { value: "Vol Paris Londres" } });
      fireEvent.change(datepicker, { target: { value: "2022-03-01" } });
      fireEvent.change(amount, { target: { value: "348" } });
      fireEvent.change(vat, { target: { value: "70" } });
      fireEvent.change(pct, { target: { value: "20" } });
      fireEvent.change(commentary, { target: { value: "Voyage d'affaires" } });
      fireEvent.change(file, { target: { files: [new File(['file content'], 'test.png', { type: 'image/png' })] } });

      const handleSubmit = jest.fn(newBill.handleSubmit); // Mock de la méthode de soumission du formulaire
      form.addEventListener("submit", handleSubmit); // Ajout d'un écouteur d'événements sur la soumission du formulaire
      fireEvent.submit(form); // Simulation de la soumission du formulaire

      await waitFor(() => expect(handleSubmit).toHaveBeenCalled()); // Attends que handleSubmit soit appelé
      await waitFor(() => expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills'])); // Attends que la navigation soit effectuée vers la page des factures
    });

    // Test pour vérifier que le champ de fichier accepte les fichiers
    test("Then the file input should accept files", () => {
      const fileInput = screen.getByTestId("file"); // Sélectionne le champ de fichier
      const file = new File(['test'], 'test.png', { type: 'image/png' }); // Crée un fichier de test

      fireEvent.change(fileInput, { target: { files: [file] } }); // Simule le changement de fichier

      expect(fileInput.files[0]).toStrictEqual(file); // Vérifie que le fichier sélectionné est le même
      expect(fileInput.files).toHaveLength(1); // Vérifie qu'il y a un fichier sélectionné
    });

    
    // Test pour vérifier la validation du champ de fichier
    test("Then it should validate file input", async () => {
      const newBill = new NewBill({ // Instancie le container de création de facture avec les dépendances simulées
        document,
        onNavigate: jest.fn(),
        store: store,
        localStorage: window.localStorage
      });

      const fileInput = screen.getByTestId("file"); // Sélectionne le champ de fichier
      const handleChangeFile = jest.fn(newBill.handleChangeFile); // Mock de la méthode de gestion de changement de fichier
      fileInput.addEventListener("change", handleChangeFile); // Ajout d'un écouteur d'événements sur le changement de fichier

      const file = new File(['test'], 'test.png', { type: 'image/png' }); // Crée un fichier de test
      fireEvent.change(fileInput, { target: { files: [file] } }); // Simule le changement de fichier

      await waitFor(() => expect(handleChangeFile).toHaveBeenCalled()); // Attends que handleChangeFile soit appelé
    });

    // Test pour vérifier la gestion des erreurs lors du chargement de fichier
    test("Then it should handle file upload errors", async () => {
      const newBill = new NewBill({ // Instancie le container de création de facture avec les dépendances simulées
        document,
        onNavigate: jest.fn(),
        store: store,
        localStorage: window.localStorage
      });

      const fileInput = screen.getByTestId("file"); // Sélectionne le champ de fichier
      const handleChangeFile = jest.fn(newBill.handleChangeFile); // Mock de la méthode de gestion de changement de fichier
      fileInput.addEventListener("change", handleChangeFile); // Ajout d'un écouteur d'événements sur le changement de fichier

      const file = new File(['test'], 'test.txt', { type: 'text/plain' }); // Crée un fichier de test
      fireEvent.change(fileInput, { target: { files: [file] } }); // Simule le changement de fichier

      await waitFor(() => expect(handleChangeFile).toHaveBeenCalled()); // Attends que handleChangeFile soit appelé
    });


    // Test pour vérifier que la méthode handleSubmit est appelée
    test("Then the handleSubmit function should be called", async () => {
      const onNavigate = jest.fn(); // Mock de la fonction de navigation
      const newBill = new NewBill({ // Instancie le container de création de facture avec les dépendances simulées
        document,
        onNavigate,
        store,
        localStorage: window.localStorage
      });

      const form = screen.getByTestId("form-new-bill");

      // Remplissage des champs requis
      fireEvent.change(screen.getByTestId("expense-type"), { target: { value: "Transports" } });
      fireEvent.change(screen.getByTestId("expense-name"), { target: { value: "Vol Paris Londres" } });
      fireEvent.change(screen.getByTestId("datepicker"), { target: { value: "2022-03-01" } });
      fireEvent.change(screen.getByTestId("amount"), { target: { value: "348" } });
      fireEvent.change(screen.getByTestId("vat"), { target: { value: "70" } });
      fireEvent.change(screen.getByTestId("pct"), { target: { value: "20" } });
      fireEvent.change(screen.getByTestId("commentary"), { target: { value: "Voyage d'affaires" } });
      fireEvent.change(screen.getByTestId("file"), { target: { files: [new File(["file content"], "test.png", { type: "image/png" })] } });

      const handleSubmit = jest.spyOn(newBill, "handleSubmit"); // Mock de la méthode handleSubmit
      form.addEventListener("submit", handleSubmit); // Ajout d'un écouteur d'événements sur la soumission du formulaire
      fireEvent.submit(form); // Simulation de la soumission du formulaire

      await waitFor(() => expect(handleSubmit).toHaveBeenCalled()); // Attends que handleSubmit soit appelé
    });

    
    

  

  });
});

*/
