import { screen, waitFor, fireEvent } from "@testing-library/dom"; 
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js"; 
import { ROUTES_PATH } from "../constants/routes.js"; 
import { localStorageMock } from "../__mocks__/localStorage.js"; 
import '@testing-library/jest-dom/extend-expect'; 
import Bills from "../containers/Bills.js"; 
import router from "../app/Router.js"; 

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    // Test pour vérifier que l'icône de fenêtre est mise en surbrillance dans la mise en page verticale
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      // Création de l'élément racine et ajout au corps du document
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);

      // Exécution du Router et navigation vers la page des factures
      router();
      window.onNavigate(ROUTES_PATH.Bills);

      // Attente du chargement de l'icône de fenêtre
      await waitFor(() => screen.getByTestId("icon-window"));

      // Vérification que l'icône de fenêtre est présente et mise en surbrillance
      const windowIcon = screen.getByTestId("icon-window");
      expect(windowIcon).toBeTruthy();
      expect(windowIcon).toHaveClass("active-icon");
    });

    // Test pour vérifier que les factures sont triées de la plus ancienne à la plus récente
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });

      // Récupération de toutes les dates et conversion en tableau
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);

      ////////////////////////////

      // Tri des dates  de la plus ancienne à la plus récente 
      const sortedDates = [...dates].sort((a, b) => (new Date(a) - new Date(b)));
      
      ////////////////////////////

      // Vérification que les dates sont triées de la plus ancienne à la plus récente
      expect(dates).toEqual(sortedDates);
    });

    /*************** tests ajoutés********************/
    /*************** *****************************/

    // Test pour vérifier si le bouton "New Bill" est cliquable et redirige vers la page de création de facture
    test("Then the 'New Bill' button should be clickable and navigate to the new bill page", () => {
      // Création du bouton "New Bill" dans le corps du document
      document.body.innerHTML = `<button data-testid="btn-new-bill" > New Bill </button>`;
      const onNavigateMock = jest.fn();

      // Instanciation de la classe Bills avec les dépendances nécessaires
      const billsInstance = new Bills({
        document,
        onNavigate: onNavigateMock,
        store: null,
        localStorage: null,
      });

      // Selection du bouton
      const buttonNewBill = screen.getByTestId("btn-new-bill");

      // Simulation du clic sur le bouton "New Bill"
      fireEvent.click(buttonNewBill);

      // Vérification que la fonction de navigation a été appelée avec l'URL appropriée
      expect(onNavigateMock).toHaveBeenCalledWith("#employee/bill/new");
    });

    // Test pour vérifier l'ouverture de la modal en cliquant sur l'icône "eye"
    test("Then a modal should open when clicking on the eye icon", async () => {
      
      // Définition du chemin de navigation
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      // Mock localStorage
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      // Enregistrement de l'utilisateur comme employé
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      // Création de la page des factures avec les dépendances nécessaires
      const billsPage = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      // Ajout du HTML des factures à la page
      document.body.innerHTML = BillsUI({ data: bills });

      // Récupération de tous les icônes "eye"
      const iconEyes = screen.getAllByTestId("icon-eye");

      // Simulation du clic sur l'icône "eye"
      iconEyes.forEach(iconEye => {
        iconEye.addEventListener("click", (e) => billsPage.handleClickIconEye(iconEye));
      });

      // Simuler un clic sur la première icône "eye"
      fireEvent.click(iconEyes[0]);

      // Attente de l'affichage de la modal
      await waitFor(() => {
        const modal = document.getElementById("modaleFile");
        expect(modal).toHaveClass("show");

        // Vérification de la présence de l'image avec l'URL correcte
        const img = modal.querySelector("img");
        expect(img).toBeTruthy();
        //expect(img.src).toBe(iconEyes[0].getAttribute("data-bill-url"));
      });

    });

    // Test pour la méthode getBills
    test("getBills should fetch and format bills from the mock API", async () => {
      
      // Mock de la fonction bills du store
      const mockedStore = {
        bills: jest.fn().mockReturnThis(),
        list: jest.fn().mockResolvedValue(bills),
      };

      const billsPage = new Bills({
        document,
        onNavigate: jest.fn(),
        store: mockedStore,
        localStorage: window.localStorage,
      });

      // Appel de la méthode getBills
      const fetchedBills = await billsPage.getBills();

      // Vérification des appels de la méthode bills et list
      expect(mockedStore.bills).toHaveBeenCalled();
      expect(mockedStore.list).toHaveBeenCalled();

      // Vérification du formatage des factures
      expect(fetchedBills).toEqual(bills.map(bill => ({
        ...bill,
        date: expect.any(String), 
        status: expect.any(String),
      })));

    });

  }); 
}); 
