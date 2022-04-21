import './style.css';

console.log("ExpressMenu is on its way also in console...");

// // Import the functions you need from the SDKs you need
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB5AUrnJbRN2zirN46PYFPt6cfbwAMvnrI",
    authDomain: "expressmenu-5dddc.firebaseapp.com",
    databaseURL: "https://expressmenu-5dddc-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "expressmenu-5dddc",
    storageBucket: "expressmenu-5dddc.appspot.com",
    messagingSenderId: "928148945512",
    appId: "1:928148945512:web:39d2d04698cba7048b99dd",
    measurementId: "G-F5YBC5V2TQ",
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const database = getDatabase(app);

async function writeData(path, data) {
    await set(ref(database, path), data);
    console.log("Data is written", path, data);
    return "Data is written...";
}

function getdatetime(date = "now") {
    let datetime;
    if (date === "now") {
        datetime = new Date().toLocaleString("en-GB", {
            timeZone: "Asia/Calcutta",
            hour12: false,
        });
        // console.log(datetime, "new date");
    } else {
        datetime = new Date(date).toLocaleString("en-GB", {
            timeZone: "Asia/Calcutta",
            hour12: false,
        });
        // console.log(datetime, "new date");
    }
    datetime = datetime.split(",");
    console.log(datetime);
    return {
        date: datetime[0],
        time: datetime[1].trim(),
    };
}

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

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user.uid);
        } else {
            console.log("user is anonymous...");
        }
    })

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
                location.href = './Assets/pages/cart.html';
            }
        }, false)
    }

    let cart_table_body = document.getElementById('cart_table_body');
    if (cart_table_body) {
        let Order_list = JSON.parse(localStorage.getItem('Orders'));
        console.log(Order_list);
        let html_to_be_added = ``;
        let total_price = 0;
        let Order_list_keys = Object.keys(Order_list);
        Order_list_keys.forEach((key) => {
            let dish = Order_list[key];
            total_price += dish.price * dish.quantity;
            let code = `
            <tr>
                <td>${key}</td>
                <td>${dish.quantity}</td>
                <td>${dish.price}</td>
                <td>${dish.price * dish.quantity}</td>
            </tr>
            `

            html_to_be_added += code;
        });
        html_to_be_added += `
        <tr>
            <td>Total Price</td>
            <td></td>
            <td></td>
            <td>${total_price}</td>
        </tr>`
        cart_table_body.innerHTML += html_to_be_added;
        console.log();

    }

    let signup_form = document.getElementById("signup_form");
    if (signup_form) {
        console.log("Signup form is present...");

        signup_form.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Form is submiting...");
            let name = document.getElementById('name').value;
            let email = document.getElementById('email').value;
            let password = document.getElementById('password').value;

            console.log(name, email, password);

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log(user);

                    location.href = "../../index.html";
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error(error);
                });
        })
    }

    let login_form = document.getElementById("login_form");
    if (login_form) {
        console.log("login form is available...");
        login_form.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Form is submiting...");
            let email = document.getElementById('email').value;
            let password = document.getElementById('password').value;

            console.log(email, password);

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log(user);

                    location.href = "../../index.html";
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(error);
                });
        });


    }

    let logout = document.getElementById("logout");
    if (logout) {
        logout.addEventListener('click', (e) => {
            e.preventDefault();
            signOut(auth);
        });
    }

    let confirmed_place_order = document.getElementById("confirmed_place_order");
    if (confirmed_place_order) {
        console.log("Confirmed Placing the order now....");
        confirmed_place_order.addEventListener('submit', (e) => {
            e.preventDefault();
            let table_no = document.getElementById("table_no").value;

            let Order = JSON.parse(localStorage.getItem('Orders'));
            let dateTime = getdatetime("now");
            let Order_id = `EXPM-${dateTime.date.split('/').join('')}-${dateTime.time.split(':').join('')}`
            let path = `orders/${Order_id}`;
            console.log(Order_id);
            // console.log(Order);
            Order["status"] = "pending";
            Order["table_no"] = table_no
            writeData(path, Order);

        })

    }

    let orders_table_body = document.getElementById('orders_table_body');
    if (orders_table_body) {
        console.log("orders_table_body is available....");

        /**
         Inside Firebase Realtime Database, the data is always stored in the form of JSON, where we will use this structure:

         orders:{
             order_id:{
                 orders_JSON,
                 status:{pending,delivered},
                 table_no:{}
             }

         }

         where order_id will comprise of userUID and dateTime
         EXM-datetime-userUID(last three)
         * 
         */



        let html_to_be_added = ``;
        const orders_database_ref = ref(database, 'orders/');
        onValue(orders_database_ref, (snapshot) => {
            if (!(snapshot.exists)) {
                console.log("problem is there...");
                return 0
            }
            console.log(snapshot.val());
            let Orders_array = snapshot.val();
            let Order_id_array = Object.keys(Orders_array);
            console.log(Order_id_array);

            let html_to_be_added = ``;

            Order_id_array.forEach((Order_id) => {
                let Order = Orders_array[Order_id];
                if (Order.status !== "pending") {
                    return 0;
                }
                console.log(Order);
                let Order_keys = Object.keys(Order);
                Order_keys.forEach((dishname, index) => {
                    console.log(dishname);
                    if (dishname === "status" || dishname === "table_no") {
                        console.log("This "+dishname+"is banned...");
                        return 0;
                    }
                    let table_no_code = ``;
                    if (index === 0) {
                        table_no_code = `<td rowspan="${Order_keys.length - 2}">${Order.table_no}</td>`;
                    }
                    let code = `
                    <tr>
                        ${table_no_code}
                        <td>${dishname}</td>
                        <td>${Order[dishname].quantity}</td>
                    </tr>
                    `
                    console.log(code);
                    html_to_be_added += code;
                })

            });

            orders_table_body.innerHTML += html_to_be_added;
        });

    }


}

