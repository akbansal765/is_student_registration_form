////////////////////////////// DOM ELEMENTS ///////////////////////////////////////
const form = document.querySelector('.form');
const studentBarContainer = document.querySelector('.student_data_bars_container');
const inputFields = document.querySelectorAll('.form_container input');
const uploadButtton = form.querySelector('button');


const studentArray = [];
///////////////////////////////////////// COMMON FUNCTIONs /////////////////////////////////////////////////////////////
function uploadStudentDataCommonFunc(obj){
    const studentBar = `
                <div class="data_bar">
                    <p class="student_name">${obj.name}</p>
                    <p class="student_id">${obj.id}</p>
                    <p class="student_email">${obj.email}</p>
                    <p class="student_contact">${obj.contact}</p>
                    <div class="buttons_box">
                       <button>
                         <img class="edit_button" src="icons/edit.png">
                       </button>
                       <button>
                         <img class="delete_button" src="icons/delete.png">
                       </button>
                    </div>
                </div>
                `;
    studentBarContainer.insertAdjacentHTML('beforeend', studentBar);
};

function deleteElement_and_updateArray(e){
        //deleting from dom
        e.target.closest('.data_bar').remove();

        //deleting from array and storting the updated array to local storage by replacing it with existing array
        const studentID_p_tag = e.target.closest('.data_bar').querySelector('.student_id');
        const studentID = studentID_p_tag.innerHTML
        const index = studentArray.findIndex(obj => obj.id == studentID);

        // deleting element from array
        studentArray.splice(index, 1);

        //adding updated student array to local storage
        localStorage.setItem('studentStorageArray', JSON.stringify(studentArray));
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////Rendering the local storage data to webpage////////////////////////
const studentStorageData = localStorage.getItem('studentStorageArray');
const studentStorageData_1 = JSON.parse(studentStorageData)
console.log(studentStorageData_1);

if(studentStorageData_1) studentStorageData_1.forEach(obj => {

    // uploadiing Data bar from local storage
    uploadStudentDataCommonFunc(obj);
    
    // pushing every local storage data to student array so that if we upload a new item, every object(new + from local storage) should store again to local storage
    studentArray.push(obj);

    if(studentArray.length > 5) {
        studentBarContainer.classList.add('overflow_class');
     }
});

/////////////////////// GETTING FORM DATA ///////////////////////////
form.addEventListener('submit', function(e){
    e.preventDefault()
    const data = [...new FormData(this)]
    const student_data = Object.fromEntries(data);
    
    // if any one of name or id is empty, do not execute
    if(student_data.name, student_data.id == '') {
        alert('Please Enter Student Name and Student ID');
        return; // early returr
    }

    // if student id alreay exists then return early and show alert
    const arr = studentArray.filter(obj => obj.id == student_data.id);
    
    if(arr.length > 0) {
        alert('Student Id already exists, choose another id');
        return;
    }
    // if(arr.length > 0) return;

    //// making input fields empty ///
    inputFields.forEach(el => el.value = '');

    //pushiing data to empty studentArray
    studentArray.push(student_data);

    //adding student array to local storage after data being pushed
    localStorage.setItem('studentStorageArray', JSON.stringify(studentArray));

    // adding each data to student bar container
     uploadStudentDataCommonFunc(student_data);

     // adding overflow property on data container
     studentBarContainer.classList.remove('overflow_class');
     
     if(studentArray.length > 5) {
        studentBarContainer.classList.add('overflow_class');
     }
});

/////////////////// Implementing DELETE and EDIT Data Bar button feature  /////////////////
studentBarContainer.addEventListener('click', function(e){
    //////////// Implementing Delete Feature ///////////////
    if(e.target.classList.contains('delete_button')) {
        //deleting element from DOM, Array and then store the updated array to local storage
        deleteElement_and_updateArray(e);

        if(studentArray.length <= 5) {
            studentBarContainer.classList.remove('overflow_class');
         }
    };

    /////////// Implementing Edit Feature ///////////////////
    if(e.target.classList.contains('edit_button')){
    const dataBar = e.target.closest('.data_bar');
    const paraTags = dataBar.querySelectorAll('p');
    
    // transferring edit data bar values to form input elements
    inputFields.forEach((inputEl, i) => {
        inputEl.value = paraTags[i].innerHTML;
    })

    // calling the delete function when user click on upload button after pressing the edit button
    uploadButtton.addEventListener('click', function(){
        deleteElement_and_updateArray(e);
    });
   
    };
});
