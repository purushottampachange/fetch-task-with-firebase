

const cl = console.log;

const blogForm = document.getElementById("blogForm");
const title = document.getElementById("title");
const content = document.getElementById("content");
const userId = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const blogContainer = document.getElementById("blogContainer");
const spinner = document.getElementById("spinner");

const postURL = "https://post-task-xhr-default-rtdb.firebaseio.com/blogs.json";

const BaseURL = "https://post-task-xhr-default-rtdb.firebaseio.com/";

const SnackBar = (icon, msg) => {

    Swal.fire({

        title: msg,
        icon: icon

    })
}

const ConvertArray = (obj) => {

    let arr = [];

    for (const key in obj) {

        let data = { ...obj[key], id: key }

        arr.push(data);
    }

    return arr;
}


const Templating = (arr) => {

    let res = "";

    arr.forEach(b => {

        res += `
          
                       <div class="card mb-4" id="${b.id}">
                        <div class="card-header">
                            <h5>${b.title}</h5>
                        </div>
                        <div class="card-body">
                            <p>${b.content}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                        </div>
                    </div>
          
        `;
    })

    blogContainer.innerHTML = res;
}

const PatchData = (obj) => {

    title.value = obj.title;

    content.value = obj.content

    submitBtn.classList.add("d-none");

    updateBtn.classList.remove("d-none");
}

const UIUpdate = (obj,id) =>{

    let card = document.getElementById(id);
    
    card.querySelector(".card-header h5").innerHTML = obj.title;

    card.querySelector(".card-body p").innerHTML = obj.content;

    submitBtn.classList.remove("d-none");

    updateBtn.classList.add("d-none");

    blogForm.reset();

}

const CreateBlog = (obj, id) => {

    cl(obj);

    let card = document.createElement("div");

    card.id = id;

    card.className = "card mb-4";

    card.innerHTML = `
       
                        <div class="card-header">
                            <h5>${obj.title}</h5>
                        </div>
                        <div class="card-body">
                            <p>${obj.content}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                        </div>
    
    `;

    blogContainer.append(card);
    blogForm.reset();

}

const MakeAPICall = async (apiURL, method, msgBody) => {

    spinner.classList.remove("d-none");

    msgBody = msgBody ? JSON.stringify(msgBody) : null;

    let confiObj = {

        method: method,
        body: msgBody,
        headers: {

            "auth": "token from local storage",
            "content-type": "application/json"
        }
    }

    try {

        let res = await fetch(apiURL, confiObj);

        return res.json();
    }
    catch (err) {

        SnackBar("error", err);

    }
    finally {

        spinner.classList.add("d-none");
    }
}

const FetchBlog = async () => {

    let res = await MakeAPICall(postURL, "GET", null);

    let data = ConvertArray(res);

    Templating(data);
}

FetchBlog();

const onEdit = async (ele) => {

    let EDIT_ID = ele.closest(".card").id;

    localStorage.setItem("EDIT_ID", EDIT_ID);

    let EDIT_URL = `${BaseURL}/blogs/${EDIT_ID}.json`;

    let res = await MakeAPICall(EDIT_URL, "GET", null);

    PatchData(res);
}

const onUpdate = async() => {

    let UPDATE_ID = localStorage.getItem("EDIT_ID");

    let UPDATE_URL = `${BaseURL}/blogs/${UPDATE_ID}.json`;

    let UPDATE_OBJ = {

        title: title.value,
        content: content.value,
        userId: userId.value,
        id : UPDATE_ID
    }

    let res = await MakeAPICall(UPDATE_URL,"PATCH",UPDATE_OBJ);
    
    UIUpdate(res,UPDATE_ID);
    
}

const onSubmit = async eve => {

    eve.preventDefault();

    let blogObj = {

        title: title.value,
        content: content.value,
        userId: userId.value,
    }

    let res = await MakeAPICall(postURL, "POST", blogObj);



    CreateBlog(blogObj, res.name);
}


blogForm.addEventListener("submit", onSubmit);
updateBtn.addEventListener("click", onUpdate);