
products = JSON.parse(localStorage.getItem('panier'))
contact = JSON.parse(localStorage.getItem('infosClient'))
prixTotal = JSON.parse(localStorage.getItem('prixTotal'))

let reference = Math.floor(Math.random() * 586324729)
document.querySelector('#salutation').innerHTML = `Bonjour <span class='font-weight-bold text-danger text-uppercase' > ${contact.name}</span>`
document.querySelector('#email-message').innerHTML = `Un email de confirmation vous a été envoyé à <span class='text-dark' > ${contact.email}</span>`
document.querySelector('#reference-commande').innerHTML = `Référence de votre commande : <span class='text-danger font-weight-bold' > ${reference}</span>`
document.querySelector('#prix-total').innerHTML = `${prixTotal},00€`
document.querySelector('#prix-total-TTC').innerHTML = `${prixTotal},00€`
localStorage.clear()
document.querySelector(".nombre-panier").innerHTML = 0

/*

fetch ("http://localhost:5500/api/teddies/order", {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: contact
})
.then((res)=> {
    if(res.ok) {console.log("commande reçue")} else {console.log(res);}
})
*/