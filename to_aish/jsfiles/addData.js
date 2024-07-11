import { sendreq } from "./request.js";

document.addEventListener('DOMContentLoaded', function () {
    console.log("AddData.js beginning")
const form = document.getElementById('donateform') //selected the form
if (form)
{console.log("AddData.js selected the form")}
else{console.log("no element such exists")}

form.addEventListener('submit', async(event) => { 
    event.preventDefault() 
    console.log("Entered add event listener")
    const formips = form.querySelectorAll('input, textarea, select')
    let datas = {}
    formips.forEach(element => {
        const {value, name} = element //selected object has properties value and name
        if (value) {
            datas[name] = value
        }
    })
    const { error, data}=await supabase.from('Requests').insert([datas])

    if (error){
        console.log("Error at adding it to the table..")
    }
    else{
        console.log("Added to the table")
    }
    sendreq()
});
 console.log("Out of the async function")
})

/*document.addEventListener('DOMContentLoaded', function () {
    console.log("AddData.js beginning")

    const form = document.getElementById('donateform') //selected the form
    if (form) {
        console.log("AddData.js selected the form")

        form.addEventListener('submit', async (event) => {
            event.preventDefault()
            console.log("Entered add event listener")

            const formips = form.querySelectorAll('input, textarea, select')
            let datas = {}
            formips.forEach(element => {
                const { value, name } = element
                if (value) {
                    datas[name] = value
                }
            })

            const { error, data } = await supabase.from('Requests').insert([datas])

            if (error) {
                console.log("Error at adding it to the table..")
            } else {
                console.log("Added to the table")
                console.log("Out of the async function")
            }
        });
    } else {
        console.log("no element such exists")
    }
});*/
