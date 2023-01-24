const resetPassword = document.querySelector("#resetPassword")
if(resetPassword)
{
    resetPassword.addEventListener("submit", (e)=>{
        e.preventDefault()
        let formData = new FormData(resetPassword)
        let formObject = {}
        for(let [key, value] of formData.entries()){
            formObject[key] = value
        }
        
        var id = window.location.href.split("/")[4]
        var token = window.location.href.split("/")[5]
        axios.post("/reset-password/"+id+"/"+token, formObject).then((res)=>{
            if(res.data == "password reset sucessfully")
            {
                location.replace("/reset-password/success")
            }
            else{
                const errorText = document.querySelector("#errorText")
                errorText.innerText = res.data
            }
        }).catch((err)=>{
            console.log(err)
        })

    })
}