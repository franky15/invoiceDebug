/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"; 
import Logout from "../containers/Logout.js"; 
import '@testing-library/jest-dom/extend-expect'; 
import { localStorageMock } from "../__mocks__/localStorage.js"; 
import DashboardUI from "../views/DashboardUI.js"; 
import userEvent from '@testing-library/user-event'; 
import { ROUTES } from "../constants/routes"; 

const bills = [{
  "id": "47qAXb6fIm2zOKkLzMro",
  "vat": "80",
  "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
  "status": "pending",
  "type": "Hôtel et logement",
  "commentary": "séminaire billed",
  "name": "encore",
  "fileName": "preview-facture-free-201801-pdf-1.jpg",
  "date": "2004-04-04",
  "amount": 400,
  "commentAdmin": "ok",
  "email": "a@a",
  "pct": 20,
}];

// Suite de tests principale pour le logout
describe('Given I am connected', () => {

  // Test pour le scénario où l'utilisateur clique sur le bouton de déconnexion
  describe('When I click on disconnect button', () => {
    test(('Then, I should be sent to login page'), () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname }); // Simule la navigation en modifiant le corps du document avec la route spécifiée
      };

      Object.defineProperty(window, 'localStorage', { value: localStorageMock }); // Définit localStorage avec un mock pour simuler le stockage local
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin' // Simule l'utilisateur connecté comme un administrateur
      }));

      document.body.innerHTML = DashboardUI({ bills }); // Affiche l'interface utilisateur du tableau de bord avec les factures simulées
      const logout = new Logout({ document, onNavigate, localStorage }); // Instancie le composant Logout avec les dépendances simulées
      const handleClick = jest.fn(logout.handleClick); // Mock de la méthode handleClick

      const disco = screen.getByTestId('layout-disconnect'); // Récupère le bouton de déconnexion dans l'interface
      disco.addEventListener('click', handleClick); // Ajoute un gestionnaire d'événements pour le clic sur le bouton de déconnexion
      userEvent.click(disco); // Simule un clic sur le bouton de déconnexion

      // Assertions pour vérifier le comportement attendu après le clic sur le bouton de déconnexion
      expect(handleClick).toHaveBeenCalled(); // Vérifie que handleClick a été appelé
      expect(screen.getByText('Administration')).toBeTruthy(); // Vérifie que le texte 'Administration' est présent sur la page, indiquant la redirection réussie
    });
  });
});
