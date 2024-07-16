/**
 * @jest-environment jsdom
 */

import LoginUI from "../views/LoginUI";
import Login from "../containers/Login.js";
import { ROUTES } from "../constants/routes";
import { fireEvent, screen } from "@testing-library/dom";

// Suite de tests principale pour la page de connexion
describe("Given that I am a user on login page", () => {

  // Première série de tests pour le bouton "Login In" de l'employé
  describe("When I do not fill fields and I click on employee button Login In", () => {
    test("Then It should render Login page", () => {
      document.body.innerHTML = LoginUI();

      // Vérifie que les champs email et mot de passe sont vides initialement
      const inputEmailUser = screen.getByTestId("employee-email-input");
      expect(inputEmailUser.value).toBe("");

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      expect(inputPasswordUser.value).toBe("");

      // Capture du formulaire et simulation de soumission
      const form = screen.getByTestId("form-employee");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      // Vérification que le formulaire est toujours présent sur la page
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });

  // Deuxième série de tests pour le bouton "Login In" de l'employé avec des champs mal renseignés
  describe("When I do fill fields in incorrect format and I click on employee button Login In", () => {
    test("Then It should render Login page", () => {
      document.body.innerHTML = LoginUI();

      // Remplissage des champs avec des données incorrectes
      const inputEmailUser = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
      expect(inputEmailUser.value).toBe("pasunemail");

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
      expect(inputPasswordUser.value).toBe("azerty");

      // Capture du formulaire et simulation de soumission
      const form = screen.getByTestId("form-employee");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      // Vérification que le formulaire est toujours présent sur la page
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });

  // Troisième série de tests pour le bouton "Login In" de l'employé avec des champs correctement renseignés
  describe("When I do fill fields in correct format and I click on employee button Login In", () => {
    test("Then I should be identified as an Employee in app", () => {
      document.body.innerHTML = LoginUI();

      // Données de test pour les champs email et mot de passe
      const inputData = {
        email: "johndoe@email.com",
        password: "azerty",
      };

      // Remplissage des champs avec les données correctes
      const inputEmailUser = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
      expect(inputEmailUser.value).toBe(inputData.email);

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: inputData.password } });
      expect(inputPasswordUser.value).toBe(inputData.password);

      // Capture du formulaire et gestion de localStorage
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });

      // Simulation de la navigation
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      // Initialisation de la classe Login avec les paramètres nécessaires
      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
      });

      // Capture de la soumission du formulaire
      const form = screen.getByTestId("form-employee");
      const handleSubmit = jest.fn(login.handleSubmitEmployee);
      login.login = jest.fn().mockResolvedValue({});
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      // Vérification des actions attendues, comme la sauvegarde dans localStorage
      expect(handleSubmit).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Employee",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );
    });

    // Test suivant pour vérifier le rendu de la page des notes de frais après la connexion
    test("It should render Bills page", () => {
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    });
  });
});

// Suite de tests pour la connexion en tant qu'administrateur
describe("Given that I am a user on login page", () => {

  // Première série de tests pour le bouton "Login In" de l'administrateur
  describe("When I do not fill fields and I click on admin button Login In", () => {
    test("Then It should render Login page", () => {
      document.body.innerHTML = LoginUI();

      // Vérifie que les champs email et mot de passe sont vides initialement
      const inputEmailUser = screen.getByTestId("admin-email-input");
      expect(inputEmailUser.value).toBe("");

      const inputPasswordUser = screen.getByTestId("admin-password-input");
      expect(inputPasswordUser.value).toBe("");

      // Capture du formulaire et simulation de soumission
      const form = screen.getByTestId("form-admin");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      // Vérification que le formulaire est toujours présent sur la page
      expect(screen.getByTestId("form-admin")).toBeTruthy();
    });
  });

  // Deuxième série de tests pour le bouton "Login In" de l'administrateur avec des champs mal renseignés
  describe("When I do fill fields in incorrect format and I click on admin button Login In", () => {
    test("Then it should render Login page", () => {
      document.body.innerHTML = LoginUI();

      // Remplissage des champs avec des données incorrectes
      const inputEmailUser = screen.getByTestId("admin-email-input");
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
      expect(inputEmailUser.value).toBe("pasunemail");

      const inputPasswordUser = screen.getByTestId("admin-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
      expect(inputPasswordUser.value).toBe("azerty");

      // Capture du formulaire et simulation de soumission
      const form = screen.getByTestId("form-admin");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      // Vérification que le formulaire est toujours présent sur la page
      expect(screen.getByTestId("form-admin")).toBeTruthy();
    });
  });

  // Troisième série de tests pour le bouton "Login In" de l'administrateur avec des champs correctement renseignés
  describe("When I do fill fields in correct format and I click on admin button Login In", () => {
    test("Then I should be identified as an HR admin in app", () => {
      document.body.innerHTML = LoginUI();

      // Données de test pour les champs email et mot de passe
      const inputData = {
        type: "Admin",
        email: "johndoe@email.com",
        password: "azerty",
        status: "connected",
      };

      // Remplissage des champs avec les données correctes
      const inputEmailUser = screen.getByTestId("admin-email-input");
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
      expect(inputEmailUser.value).toBe(inputData.email);

      const inputPasswordUser = screen.getByTestId("admin-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: inputData.password } });
      expect(inputPasswordUser.value).toBe(inputData.password);

      // Capture du formulaire et gestion de localStorage
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });

      // Simulation de la navigation
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      // Initialisation de la classe Login avec les paramètres nécessaires
      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
      });

      // Capture de la soumission du formulaire
      const form = screen.getByTestId("form-admin");
      const handleSubmit = jest.fn(login.handleSubmitAdmin);
      login.login = jest.fn().mockResolvedValue({});
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      // Vérification des actions attendues, comme la sauvegarde dans localStorage
      expect(handleSubmit).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Admin",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );
    });

    // Test suivant pour vérifier le rendu du tableau de bord RH après la connexion
    test("It should render HR dashboard page", () => {
      expect(screen.queryByText("Validations")).toBeTruthy();
    });
  });
});
