
produits = JSON.parse(localStorage.getItem('panier'))
infosClient = JSON.parse(localStorage.getItem('infosClient'))
prixTotal = JSON.parse(localStorage.getItem('prixTotal'))
let reference = Math.floor(Math.random() * 586324729)
document.querySelector('#salutation').innerHTML = `Bonjour <span class='font-weight-bold text-danger text-uppercase' > ${infosClient.name}</span>`
document.querySelector('#email-message').innerHTML = `Un email de confirmation vous a été envoyé à <span class='text-dark' > ${infosClient.email}</span>`
document.querySelector('#reference-commande').innerHTML = `Référence de votre commande : <span class='text-danger font-weight-bold' > ${reference}</span>`
document.querySelector('#prix-total').innerHTML = `${prixTotal},00€`
document.querySelector('#prix-total-TTC').innerHTML = `${prixTotal},00€`
localStorage.clear()
document.querySelector(".nombre-panier").innerHTML = 0

