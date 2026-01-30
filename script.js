// console.log(images)
//
//let numCase = 0
//
//
//images.forEach(function(banane){
//    console.log("Image : " + banane)
//    document.querySelector(".liste-images").innerHTML+="<section><h2><em>"+banane+
//    "</em></h2>"+descriptionImages[numCase]+"</section>"
//    numCase+=1
//})
//
//console.log(numCase)

// console.log(data);

// data.forEach(function(element) {
//    console.log("Image : " + element.titre);
//    
//    document.querySelector(".liste-images").innerHTML += 
//        "<section>" +
//            "<h2><em>" + element.titre + "</em></h2>" +
//            "<img src='" + element.imagePetite + "' alt='" + element.titre + "' class='image-cliquable'>" +
//            element.descriptionImage +
//            "<p class='source'>Source : <a href='" + element.source + "' target='_blank'>" + element.copyright + "</a></p>" +
//        "</section>";
//});

fetch('images.json').then(function(response) { 
   response.json().then(function(data) { 
      console.log(data);
      
      // Template HTML avec marqueurs
      let codeDuBloc = `
          <div class="carte-image">
              <h3><em>{{titre}}</em></h3>
              <img src='{{imagePetite}}' alt='{{titre}}' class='image-cliquable' data-grande='{{imageGrande}}'>
              {{descriptionImage}}
              <p class='source'>Source : <a href='{{source}}' target='_blank'>{{copyright}}</a></p>
          </div>
      `;
      
      // Séparer les images en 2 groupes
      let groupe1 = data.slice(0, 3); // 3 premières images
      let groupe2 = data.slice(3, 6); // 3 images suivantes
      
      // Fonction pour générer les cartes d'images
      function genererImages(images, conteneurId) {
          images.forEach(function(element) {
              console.log("Image : " + element.titre);
              
              let blocHTML = codeDuBloc;
              
              blocHTML = blocHTML.replace(/{{titre}}/g, element.titre);
              blocHTML = blocHTML.replace(/{{imagePetite}}/g, element.imagePetite);
              blocHTML = blocHTML.replace(/{{imageGrande}}/g, element.imageGrande);
              blocHTML = blocHTML.replace(/{{descriptionImage}}/g, element.descriptionImage);
              blocHTML = blocHTML.replace(/{{source}}/g, element.source);
              blocHTML = blocHTML.replace(/{{copyright}}/g, element.copyright);
              
              document.getElementById(conteneurId).innerHTML += blocHTML;
          });
      }
      
      // Générer les 2 groupes d'images
      genererImages(groupe1, 'groupe-1');
      genererImages(groupe2, 'groupe-2');
      
      // === FENÊTRE MODALE ===
      
      let imagesCliquables = document.querySelectorAll('.image-cliquable');
      
      imagesCliquables.forEach(function(img) {
          img.addEventListener('click', function() {
              let urlGrandeImage = this.getAttribute('data-grande');
              document.getElementById('image-popup').src = urlGrandeImage;
              
              let popup = document.querySelector('.popup');
              popup.classList.remove('popup-invisible');
              popup.classList.add('popup-visible');
              
              console.log("Popup ouverte avec : " + urlGrandeImage);
          });
      });
      
      let popup = document.querySelector('.popup');
      
      popup.addEventListener('click', function() {
          this.classList.remove('popup-visible');
          this.classList.add('popup-invisible');
          console.log("Popup fermée");
      });
      
      let boutonFermeture = document.querySelector('.cache-fenetre');
      
      boutonFermeture.addEventListener('click', function(e) {
          e.stopPropagation();
          let popup = document.querySelector('.popup');
          popup.classList.remove('popup-visible');
          popup.classList.add('popup-invisible');
          console.log("Popup fermée via bouton");
      });
      
      document.getElementById('image-popup').addEventListener('click', function(e) {
          e.stopPropagation();
      });
      
      // === FORMULAIRE ===
      
      let champTitre = document.getElementById('titre');
      let champDescription = document.getElementById('description');
      
      champTitre.addEventListener('keyup', function() {
          console.log("Titre : " + this.value);
      });
      
      champDescription.addEventListener('keyup', function() {
          console.log("Description : " + this.value);
      });
      
      let boutonEnvoi = document.getElementById('bouton-envoi');
      let messageRetour = document.getElementById('message-retour');
      
      boutonEnvoi.addEventListener('click', function() {
          let titre = document.getElementById('titre').value;
          let description = document.getElementById('description').value;
          let urlImage = document.getElementById('url-image').value;
          let email = document.getElementById('email').value;
          
          if (!titre || !description || !urlImage || !email) {
              messageRetour.textContent = "Tous les champs sont obligatoires !";
              messageRetour.className = "erreur";
              return;
          }
          
          let message = "Nouvelle image proposée : " + titre + " - " + description + " - URL: " + urlImage;
          
          message = encodeURIComponent(message);
          email = encodeURIComponent(email);
          
          let urlAPI = "https://gambette.butmmi.o2switch.site/api.php?format=json&login=login_ici&message=" + message + "&email=" + email; // Je n'ai pas trouvé comment avoir mon login...
          
          console.log("Envoi vers l'API : " + urlAPI);
          
          boutonEnvoi.disabled = true;
          boutonEnvoi.textContent = "Envoi en cours...";
          
          fetch(urlAPI)
              .then(function(response) {
                  return response.json();
              })
              .then(function(data) {
                  console.log("Réponse de l'API :", data);
                  
                  if (data.status === "success") {
                      messageRetour.textContent = "Votre proposition a été envoyée avec succès !";
                      messageRetour.className = "succes";
                      
                      document.getElementById('titre').value = "";
                      document.getElementById('description').value = "";
                      document.getElementById('url-image').value = "";
                      document.getElementById('email').value = "";
                  } else {
                      messageRetour.textContent = "Erreur : " + (data.message || "Erreur inconnue");
                      messageRetour.className = "erreur";
                  }
              })
              .catch(function(error) {
                  console.error("Erreur lors de l'envoi :", error);
                  messageRetour.textContent = "Erreur de connexion à l'API";
                  messageRetour.className = "erreur";
              })
              .finally(function() {
                  boutonEnvoi.disabled = false;
                  boutonEnvoi.textContent = "Envoyer ma proposition";
              });
      });
   });
});