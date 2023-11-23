 /*const form = document.querySelector('#loginform') //selected the form
    
 form.addEventListener('submit', async(event) => { 
    event.preventDefault() 
    //creating a user to authenticate       
    const { data, error } = await supabase.auth.signInWithPassword({
        email: document.getElementById('email1').value ,
        password: document.getElementById('password1').value,
    })

    if (error){
        alert(`Error: ${error.message}`);
    }
    else{
        let whoI = document.getElementById('who').value
        console.log(whoI)
        if(whoI == 1){
            window.location.href = "donor.html";
        }
        if(whoI == 2){
            window.location.href = "charity.html";
        }
        if(whoI == 3){
            window.location.href = "volunteer.html";
        }
    }
})
*/