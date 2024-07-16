import { ROUTES_PATH } from '../constants/routes.js'

export default class Logout {
  constructor({ document, onNavigate, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.localStorage = localStorage
    //$('#layout-disconnect').click(this.handleClick)

    /////////////////////////////
    // Utiliser JavaScript natif pour sélectionner l'élément et ajouter un événement
    document.addEventListener("DOMContentLoaded", () => {
      const disconnectButton = document.getElementById('layout-disconnect');
      if (disconnectButton) {
        disconnectButton.addEventListener('click', this.handleClick);
      }
    });

    // console.log('***disconnectButton', disconnectButton)

    /////////////////////////////
  }
  
  handleClick = (e) => {
    this.localStorage.clear()
    this.onNavigate(ROUTES_PATH['Login'])
  }
} 