

const cl = console.log;

const blogForm = document.getElementById("blogForm");
const title = document.getElementById("title");
const content = document.getElementById("content");
const userId = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const blogContainer = document.getElementById("blogContainer");

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





const MakeAPICall = async(apiURL,method,msgBody) =>{

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
}

const FetchBlog = async () =>{   

    let res = await MakeAPICall(postURL,"GET",null);

    let data = ConvertArray(res);

    cl(data);
}

FetchBlog();