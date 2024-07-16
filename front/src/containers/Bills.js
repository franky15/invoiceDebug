import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store

    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)

    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon))
    })

    new Logout({ document, localStorage, onNavigate })
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  handleClickIconEye(icon) {

    //code converti de jquery vers js
    const billUrl = icon.getAttribute("data-bill-url");
    const modal = document.getElementById("modaleFile");
    const modalBody = modal.querySelector(".modal-body");
  
    // Calcul de la largeur de l'image
    const imgWidth = "100%"; // Valeur de largeur fixe pour tester (par exemple)
   
    // Création de l'élément contenant l'image
    const imgElement = document.createElement("img");
    imgElement.setAttribute("width", imgWidth);
    imgElement.setAttribute("src", billUrl);
    imgElement.setAttribute("alt", "Bill");
  
    // Efface le contenu précédent de modalBody
    modalBody.innerHTML = "";
    
    // Ajoute l'image à modalBody
    modalBody.appendChild(imgElement);
  
    // Affichage de la modal en utilisant du JavaScript pur
    this.showModal(modal);


  }
  
  showModal(modal) {

    modal.classList.add('show');
    modal.style.display = 'block';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');

    // Ajout du backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);

    // Ajout d'un écouteur pour fermer la modal
    const closeButton = modal.querySelector('.close');
    if (closeButton) {
   

      closeButton.addEventListener('click', () => this.hideModal(modal));
    }
  }

  hideModal(modal) {

    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeAttribute('role');
    
    // Suppession du backdrop
    const backdrop = document.querySelector('.modal-backdrop');

    if (backdrop) {
      document.body.removeChild(backdrop);
    }

  }

  getBills = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then(snapshot => {
          const bills = snapshot.map(doc => {
            try {
              return {
                ...doc,
                date: formatDate(doc.date),
                status: formatStatus(doc.status)
              }
            } catch(e) {
              console.log(e, 'for', doc)
              return {
                ...doc,
                date: doc.date,
                status: formatStatus(doc.status)
              }
            }
          })
          return bills 
        })
    }
  }
}
