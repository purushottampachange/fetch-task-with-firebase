

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

const SnackBar = (icon,msg) =>{

    Swal.fire({
   
        title : msg,
        icon : icon

    })
}

const ConvertArray = (obj) =>{
   
    let arr = [];

    for (const key in obj) {
         
        let data = {...obj[key],id:key}
        
        arr.push(data);
    } 

    return arr;
}


const Templating = (arr) =>{

    let res = "";

    arr.forEach(b =>{

        res+= `
          
                       <div class="card mb-4">
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

const CreateBlog = (obj,id) =>{

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

const MakeAPICall = async(apiURL,method,msgBody) =>{

    spinner.classList.remove("d-none");

    msgBody = msgBody ? JSON.stringify(msgBody) : null;

    let confiObj = {

        method : method,
        body : msgBody,
        headers :{

            "auth" : "token from local storage",
            "content-type" : "application/json"
        }
    }

    try{

        let res = await fetch(apiURL,confiObj);

        return res.json();
    }
    catch(err){
    
        SnackBar("error",err);
        
    }
    finally{

        spinner.classList.add("d-none");
    }
}

const FetchBlog = async () =>{   

    let res = await MakeAPICall(postURL,"GET",null);

    let data = ConvertArray(res);

    Templating(data);
}

FetchBlog();

const onSubmit =async eve =>{

    eve.preventDefault();

    let blogObj = {

        title : title.value,
        content : content.value,
        userId : userId.value
    }

    let res  = await MakeAPICall(postURL,"POST",blogObj);
  


    CreateBlog(blogObj,res.name);
}


blogForm.addEventListener("submit",onSubmit);