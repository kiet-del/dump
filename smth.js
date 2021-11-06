var Actuator = document.querySelector(".Actuator");
Actuator.addEventListener("click", showMenu, false);

var close = document.querySelector("#close");
close.addEventListener("click", hideMenu, false);
var Menu = document.querySelector(".Menu");

function showMenu(e) {
    Menu.classList.add("show");

    document.body.style.overflow = "hidden";
}

function hideMenu(e) {
    Menu.classList.remove("show");
    e.stopPropagation();

    document.body.style.overflow = "auto";
}

const cartBtn = document.querySelector('.cart-btn');
const closecartBtn = document.querySelector('#close-cart');
const clearcartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.TheCart');
const cartOverlay = document.querySelector('.HiddenCary');
const cartItems = document.querySelector('.realcounts');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

let cart = []

let buttonsDOM = [];

class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json');
            let data = await result.json();

            let products = data.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image }
            })
            return products
        } catch (error) {
            console.log(error);
        }
    }
}

class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += `
            <article class="clothes">
                    <div class="img-cont ">
                        <img src=${product.image} alt="something ab clothes" class="product-img">
                        <button class="addcart-btn" data-id=${product.id}>
                            Add to cart
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4>$${product.price}</h4>
                </article>
            `;
        });
        productsDOM.innerHTML = result;
    }
    getBagButtons() {
        const buttons = [...document.querySelectorAll(".addcart-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id)
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true
            }
            button.addEventListener('click', (event) => {
                event.target.innerText = "In Cart";
                event.target.disabled = true;

                let cartItem = {...Storage.getProduct(id), amount: 1 };

                cart = [...cart, cartItem];

                Storage.saveCart(cart);

                this.setCartValues(cart);

                this.addCartItem(cartItem)
            });
        });
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;

    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src="${item.image}" alt=" ">
        <div class="infos ">
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>Remove</span>
        </div>
        <div style="margin-left: 200px; height: 75px; display: flex; flex-flow:column; align-items: center; margin-top: 20px; ">
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p style="margin: 0; " class="item-amount ">1</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>
        `
    }
}

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id)
    }
    static saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
    });
});