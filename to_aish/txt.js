    //a random js file to store some code
    
    const { createClient } = supabase
    supabase = createClient('https://jdpmvcqvpoettcqrwwcp.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkcG12Y3F2cG9ldHRjcXJ3d2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA0MDM1NzEsImV4cCI6MjAxNTk3OTU3MX0.DEVGEK7cU38SsU9fgbP85ERlSLJuPO7gdt_8zcWzsxM')

    const form = document.querySelector('#donate-form') //selected the form
    form.addEventListener('submit', async(event) => { 
        event.preventDefault() 

        const formips = form.querySelectorAll('input, textarea, select')
        let datas = {}
        formips.forEach(element => {
            const {value, name} = element //selected object has properties value and name
            if (value) {
                datas[name] = value
            }
        })
        const { error, data}=await supabase.from('Requests').insert([datas])
        console.log(error, data)     
    })
