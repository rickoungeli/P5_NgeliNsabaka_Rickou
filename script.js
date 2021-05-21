
//J'envoie la reqûete et j'interprete les résultats
//fetch ("https://rickoungeli.github.io/ngelinsabakarickou_5_18052021/api/teddies")
fetch ("http://localhost:5500/api/teddies") 
    .then (function(response) {if (response.ok) {return response.json()}})
    .then(function(value) {
        //Je cible la #conteneur puisque je vais injecter des éléments html
        let conteneurProduits = document.getElementById('conteneurProduits')
        for (let i=0; i<value.length; i++) {
            //Je récupère les données dans les variables
            let id = value[i]._id ;
            let nom = value[i].name;
            let price = value[i].price;
            let couleurs = value[i].colors;   
            let imageUrl = value[i].imageUrl        
            let description1 = value[i].description;
            let description
            if (description1.length>50) {
                description = description1.substring(0,80) + '(...)'
               if(document.body.clientWidth<470) {description = (description1.substring(0,50) + '(...)')}
               if((document.body.clientWidth>=470) && (description1.length>=320)) {description = (description1.substring(0,150) + '(...)')}
            } 
            else {description = description1} 

            //Je crée un Carte cliquable et je l'ajoute dans #Conteneur
            let card = document.createElement("a") 
            card.classList.add('Card')
            card.setAttribute('href','ficheproduit.html')
            conteneurProduits.appendChild(card)
            //Dans le card, j'ajoute le code ci-après :
            card.innerHTML = "<div class='photo'><img src='"+imageUrl+"'></div><div class='descry'><p class='nom'>"+nom+"</p><p class='description'>"+description+"</p><div class='prix'><p>"+price+"</p><p>€</p></div></div>"       
        }
    }) 
    .catch(function(err) {alert (err)});