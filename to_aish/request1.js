document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.getElementById('formbtn');
  console.log("Entered the DOM")
  submitButton.addEventListener('click', handleFormSubmit);
});

async function handleFormSubmit() {
  // Gather data from the form
  console.log("Inside the asynch function")

  const foodType = document.getElementById('food_type').value;
  const foodWeight = document.getElementById('foodWeight').value;
  const foodItems = document.getElementById('foodItems').value;
  const foodTime = document.getElementById('foodTime').value;
  console.log("Gathered the data from the form")
 
   //fetching the data from Donor Table
    try{
    const DonorName = await supabase.from('Donor').select('Name').eq('Email', storedEmail).single();
    const DonorAddr = await supabase.from('Donor').select('Address').eq('Email', storedEmail).single();
    console.log("Fetched data from donor", DonorAddr.data.Address, DonorName.data.Name);
    const { data, error } = await supabase.from('Requests').insert([
      {
        food_type:foodType,
        Quantity:foodWeight,
        Items: foodItems,
        Date: foodTime,
        Address: DonorAddr.data.Address,
        donor_name: DonorName.data.Name
      }])

    if(error){
      console.log("Failed to insert data: ", error.message)
    }
    else{
      console.log("Data successfully inserted to Requests..",data)
    }
    }
  catch (e){console.log("Failed to fetch from donor..")}

    
  }
