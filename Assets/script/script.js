console.log("ExpressMenu is on its way also in console...");

const data = {
    snacks: {
        "Samosa": 19,
        "PaavVada": 19,
        "VadaPaav": 19,
        "Sandwich": 19,
        "Kachori": 19
    },

    beverages: {
        "CocoCola": 15,
        "Sting": 20,
        "Pepsi": 20,
        "Frooti": 20,
        "AppyFizz": 20
    },

    desserts: {
        "IceCream": 30,
        "Kulfi": 20,
        "GulabJamun": 8,
        "Jalebi": 25,
        "ShaadiKaLadoo": 200
    },

    mainCourse: {
        "Panner": 30,
        "Rice": 20,
        "Mushroom": 8,
        "VegKolhapuri": 25,
        "ShaadiKiPlate": 2000
    }
}

let Order_list = {};
window.onload = () => {
    console.log("window is loaded....");

    let accordian_content_array = document.getElementsByClassName("accordian_content");
    if (accordian_content_array) {
        for (let index = 0; index < accordian_content_array.length; index++) {
            const accordian_content = accordian_content_array[index];
            // console.log(accordian_content, "ac");

            let name = accordian_content.id;
            // console.log(name, "name ac");

            let data_obj = data[name.split('_')[0]];
            // console.log(data_obj);

            let data_obj_keys = Object.keys(data_obj);
            // console.log(data_obj_keys);

            let html_to_be_added = '';

            data_obj_keys.forEach((key) => {
                // console.log(key);
                const code = `
                    <label for="${key}">
                        <input type="checkbox" name="${name}" id="${key}" data-price="${data_obj[key]}">
                        ${key} : ${data_obj[key]}
                    </label>`
                // console.log(code);
                html_to_be_added += code;
            })
            accordian_content.innerHTML = html_to_be_added;

        }
    }

    let site_wrapper = document.getElementById("site_wrapper");
    if (site_wrapper) {
        console.log("Site wrapper exists....");

        localStorage.removeItem('Orders');

        site_wrapper.addEventListener('click', (e) => {
            console.log("Site Wrapper is clicked...");
            let target = e.target;
            console.log(target);

            if (target.classList.contains('accordian')) {
                console.log("only accordian....");
                target.classList.toggle('active');

                let id = target.id;
                console.log(id);
                var menu = target.nextElementSibling;
                // let menu = document.getElementById(id + "_menu");

                // menu.innerHTML = id + 12;
                if (menu.style.maxHeight) {
                    menu.style.maxHeight = null;
                } else {
                    menu.style.maxHeight = menu.scrollHeight + "px";
                }
                // console.log(menu);
            }
            if (target.tagName === "INPUT") {

                console.log("input i s pressed...");
                let dishname = target.id;
                let price = target.getAttribute("data-price");
                if (target.checked) {
                    console.log("it is checked....", dishname, price);

                    if (Object.keys(Order_list).indexOf(dishname) === -1) {
                        Order_list[dishname] = { price: price, quantity: 1 };
                    }
                    console.log(Order_list, Object.keys(Order_list).indexOf(dishname));
                } else {
                    console.log("it is unchecked....");
                    if (Object.keys(Order_list).indexOf(dishname) !== -1) {
                        delete (Order_list[dishname]);
                    }
                    console.log(Order_list);
                }
                if (target.getAttribute('name') === "quantity") {
                    console.log("Quantity is changed...");
                    let parent = target.parentElement;
                    let sibling = parent.previousElementSibling;
                    console.log(parent, sibling.textContent);
                    let ordered_dishname = sibling.textContent;
                    Order_list[ordered_dishname].quantity = target.value;
                    console.log(Order_list);
                }
            }

            if (Order_list) {
                let order_cart = document.getElementById("order_cart");
                if (order_cart) {
                    let Order_list_keys = Object.keys(Order_list);
                    let html_to_be_added = ``;
                    Order_list_keys.forEach((key) => {
                        let code = `
                        <div>
                            <p>${key}</p>
                            <label for="${key + "_quantity"}">
                                <input class="outline outline-1 " type="number" name="quantity" id="${key + "_quantity"}" value="${Order_list[key].quantity}" min="1">
                            </label>
                            <p>${Order_list[key].price}</p>
                        </div>
                       `
                        // console.log(code);
                        html_to_be_added += code;
                    });
                    order_cart.innerHTML = html_to_be_added;
                }
            }

            if (target.id === "place_order" || target.id === "place_order_text") {
                console.log("Order is placed...");
                console.log(Order_list);
                localStorage.setItem("Orders", JSON.stringify(Order_list));
                location.href='./Assets/pages/cart.html';
            }
        }, false)
    }

    let cart_table_body=document.getElementById('cart_table_body');
    if(cart_table_body){
        let Order_list=JSON.parse(localStorage.getItem('Orders'));
        console.log(Order_list);
        let html_to_be_added=``;

        let Order_list_keys=Object.keys(Order_list);
        Order_list_keys.forEach((key)=>{
            let dish=Order_list[key];

            let code=`
            <tr>
                <td>${key}</td>
                <td>${dish.quantity}</td>
                <td>${dish.price}</td>
                <td>${dish.price * dish.quantity}</td>
            </tr>
            `

            html_to_be_added+=code;
        });

        cart_table_body.innerHTML+=html_to_be_added;
        console.log();

    }

}