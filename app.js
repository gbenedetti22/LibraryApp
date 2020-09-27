const charterer_col = document.querySelectorAll(".book-user");
const input_form= document.querySelector(".user-form");
const btn_add = document.querySelector(".btn-add");
let current_user_cell;
const hour_rate=0.65;

input_form.style.display="none";

function display_input(e){
    input_form.style.display ="inline";
    current_user_cell=e.target;
}

function insert_user(e){
    e.preventDefault();
    const user_name=document.querySelector(".user-name");
    const user_surname=document.querySelector(".user-surname");
    const date=document.querySelector(".date");

    if(user_name == null && user_surname == null && date.value === ""){
        alert("Errore nell inserimento dell utente!");
        return;
    }

    const rate=getRate(date);
    if(rate === undefined){
        alert("Errore: la data di destinazione non può essere più piccola della data di oggi!");
        return;
    }

    current_user_cell.innerText=
        "- "+ user_surname.value + " " + user_name.value + "\n"
        + "- "+ date.value + "\n"
        + "- "+ rate +" euro";
    user_surname.value= "";
    user_name.value= "";
    date.value= "";

    input_form.style.display="none";
}

function getRate(date){
    const today = getTodayDate();
    const date1 = new Date(today);
    const date2 = new Date(date.value);
    if(date2 < date1){
        return;
    }

    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.round(diffDays*hour_rate);
}
function getTodayDate(){
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
}
for (let i = 0; i < charterer_col.length; i++) {
    charterer_col[i].addEventListener("click",display_input);
}

btn_add.addEventListener("click",insert_user);