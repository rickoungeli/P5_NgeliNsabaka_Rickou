
    

//<div class='produit'><div class='photo'><img src='"+imageUrl+"' alt='Photo de l\'animal'><p class='id'>"+id+"</p></div><div class='descry'><p class='nom'>"+nom+"</p><p class='description'>"+description+"</p><div class='prix'><p>"+price+"</p><p>€</p></div></div></div>"
//J'envoie la reqûete et j'interprete les résultats
fetch ("https://rickoungeli.github.io/ngelinsabakarickou_5_18052021/api/teddies")
//fetch ("http://localhost:5500/api/teddies") 
    .then (function(response) {if (response.ok) {return response.json() }})
    .then(function(value) {
        //Je cible la #conteneur puisque je vais injecter des éléments html
        let conteneur = document.getElementById("conteneur") 
     
        for (let i=0; i<value.length; i++) {
            //Je récupère les données dans les variables
            let id = value[i]._id ;
            let nom = value[i].name;
            let price = value[i].price;
            let couleurs = value[i].colors;           
            let description = value[i].description;
            let imageUrl = value[i].imageUrl;

            //Je crée une div ayant la classe produits et je l'ajoute dans Conteneur
            let produits = document.createElement("div")
            produits.classList.add('produits')
            conteneur.appendChild(produits)
            let lien = document.createElement("a") 
            lien.classList.add('lien')
            lien.setAttribute('href','ficheproduit.html')
            produits.appendChild(lien)
            //produits.innerHTML = "<a class='lien' href='ficheproduit.html'>"
            
            
            //Je crée une Div contenant la photo et je l'ajoute dans div_produit
                let Div_Photo = document.createElement('div')
                Div_Photo.classList.add('photo')
                lien.appendChild(Div_Photo)
                Div_Photo.innerHTML = "<img src='"+imageUrl+"' alt='Photo de l\'animal'>"
            
                //Je crée une autre Div contenant les autres infos du produit
                let Div_Descry = document.createElement('div')
                Div_Descry.classList.add('descry')
                
                lien.appendChild(Div_Descry)
                Div_Descry.innerHTML = "<p class='nom'>"+nom+"</p><p class='description'>"+description+"</p><div class='prix'><p>"+price+"</p><p>€</p></div>"
        }
    })
            


    
    .catch(function(err) {alert ('un problème est survenue, merci de vérifier !')+err});

    


            
/*
let htmlElt = document.querySelector('html');
let bgColor = document.getElementById('bgtheme');
bgColor.addEventListener('change', setBg);
if(localStorage.getItem('bgtheme')){
    updateBg();}
else {
    setBg();
}

function updateBg(){
    let bg = localStorage.getItem('bgtheme');
    htmlElt.style.backgroundColor = '#' + bg;
}

function setBg(){
    localStorage.setItem('bgtheme', bgColor.value);
    updateBg();
}
*/