const charterer_col = document.querySelectorAll(".book-user");
const input_form= document.querySelector(".user-form");
const btn_add = document.querySelector(".btn-add");
const filter_input= document.querySelector(".filter-input");
const table=document.querySelector(".library-table");
const table_rows= document.querySelectorAll(".library-table tr");

const dialog=document.querySelector(".dialog");
const dialog_btn_modify= document.querySelector(".dialog-btn-modify");
const dialog_btn_delete= document.querySelector(".dialog-btn-delete");
let current_money= document.getElementById("money");
const dialog_btn_close= document.querySelector(".close");

let current_user_cell;
const hour_rate=0.65;

input_form.style.display="none";

function display_input(e){
    input_form.style.display ="inline";
    document.querySelector(".user-surname").focus();
    current_user_cell=e.target;
}
function insert_user(e){
    e.preventDefault();
    const user_name=document.querySelector(".user-name");
    const user_surname=document.querySelector(".user-surname");
    const date=document.querySelector(".date");

    if(user_name.value === "" || user_surname.value === "" || date.value === ""){
        alert("Errore nell inserimento dell utente!");
        return;
    }
    if(user_name.value.includes("-") || user_surname.value.includes("-")){
        alert("Carettere non ammesso");
        return;
    }

    const rate=getRate(date);
    if(rate === undefined){
        alert("Errore: la data di destinazione non può essere più piccola della data di oggi!");
        return;
    }

    current_user_cell.innerText=
        "- "+ user_surname.value + " " + user_name.value + "\n"
        + "- "+ date.value.replace(/-/g, '/') + "\n"
        + "- "+ rate +" euro";
    user_surname.value= "";
    user_name.value= "";
    date.value= "";

    input_form.style.display="none";
    current_user_cell.removeEventListener("click",display_input);
    current_user_cell.addEventListener("click", openDialog);
}
function delete_user(e){
    e.preventDefault();
    let confirm_prompt= confirm("Sei sicuro di voler cancellare l utente? I soldi verrano accreditati e visualizzati sulla pagina");
    if(!confirm_prompt){
        return;
    }
    console.log(current_user_cell);
    console.log(current_user_cell.innerText.split("- "));
    let money=Number(current_user_cell.innerText.split("- ")[3].replace(" euro",""));
    let new_money= parseInt(current_money.innerText)+money;
    current_money.innerText=new_money.toString();

    if(100 < new_money && new_money < 500){
        current_money.style.color= "orange";
    }else if(new_money > 500){
        current_money.style.color= "green";
    }

    current_user_cell.innerText="+";
    current_user_cell.addEventListener("click",display_input);
    current_user_cell.removeEventListener("click",openDialog);
    closeDialog();
}
function modify_user(e){
    e.preventDefault();
    const dialog_name= document.querySelector(".dialog-name");
    const dialog_surname= document.querySelector(".dialog-surname");

    if(dialog_name.value.includes("-") || dialog_surname.value.includes("-")){
        alert("Carettere non ammesso");
        return;
    }
    const current_data=current_user_cell.innerText.replace(/\n/,"").split("-");

    let name=current_data[1].split(" ");
    name[1]=(dialog_surname.value === "") ? name[1] : dialog_surname.value;
    name[2]=(dialog_name.value === "") ? name[2] : dialog_name.value;

    current_user_cell.innerText=
        "- "+ name[1] + " " + name[2] + "\n"
        + "- "+ current_data[2] + "- "+ current_data[3];
    dialog_surname.value= "";
    dialog_name.value= "";
    closeDialog();
}
function openDialog(e) {
    dialog.style.display="block";
    current_user_cell=e.target;
}
function filter_table(e){
    let key_pressed= e.target.value.toUpperCase();

    for (let i = 1; i < table.tBodies[0].rows.length; i++) {
        let current_cell=table_rows[i].querySelectorAll("th")[0].innerText.toUpperCase();
        if(current_cell.includes(key_pressed)) {
            table_rows[i].style.display="";
        }else{
            table_rows[i].style.display="none";
        }
    }

}

function closeDialog() {
    dialog.style.display="none";
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
filter_input.addEventListener("keyup", filter_table);
dialog_btn_delete.addEventListener("click",delete_user);
dialog_btn_modify.addEventListener("click", modify_user);
dialog_btn_close.addEventListener("click",closeDialog);