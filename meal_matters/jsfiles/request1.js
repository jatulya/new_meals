document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.getElementById('formbtn');
  console.log("Entered the DOM")
  submitButton.addEventListener('click', handleFormSubmit);
});

async function handleFormSubmit() {
  // Gather data from the form
  console.log("Inside the async function")

  const foodType = document.getElementById('food_type').value;
  const foodWeight = document.getElementById('foodWeight').value;
  const foodItems = document.getElementById('foodItems').value;
  const foodTime = document.getElementById('foodTime').value;
  console.log("Gathered the data from the form")

   // Check if the difference between foodTime and current date is more than a day
   const currentDate = new Date();
   const foodTimeDate = new Date(foodTime);
   const diffInMs = currentDate.getTime() - foodTimeDate.getTime();
   const diffInDays = diffInMs / (1000 * 3600 * 24);
 
   if (diffInDays > 1) {
    const errorMessage = document.createElement('div');
    errorMessage.innerHTML = 'Cannot make a request because food is old';
    errorMessage.style.color = 'red';
    document.getElementById('error-container').appendChild(errorMessage); 
    return; 
  }

  checkInvalidPreviousRequests()
 
   //fetching the data from Donor Table
    try{
    const DonorName = await supabase.from('Donor').select('Name').eq('Email', storedEmail).single();
    const DonorAddr = await supabase.from('Donor').select('Address').eq('Email', storedEmail).single();
    console.log("Fetched data from donor", DonorAddr.data.Address, DonorName.data.Name);
    const { data, error } = await supabase.from('Requests').insert([
      {
        food_type:foodType,
        Quantity:foodWeight,
        Items: foodItems, //different request for each item --> else not even 1nf
        Date: foodTime,
        Address: DonorAddr.data.Address, //should we really need the address
        donor_name: DonorName.data.Name //should change it to donor id
      }])

    if(error){
      console.log("Failed to insert data: ", error.message)
    }
    else{
      console.log("Data successfully inserted to Requests..",data)
      clearForm('donateform')
    }
    }
  catch (e){console.log("Failed to fetch from donor..")}

}

function clearForm(formId) {
    const form = document.getElementById(formId);
    console.log("inside the clearForm function..")
    if (form) {
        // Iterate through all form elements
        for (const element of form.elements) {
            // Check if the element is an input, select, or textarea
            if (
                element.tagName === 'INPUT' ||
                element.tagName === 'SELECT' ||
                element.tagName === 'TEXTAREA'
            ) {
                // Clear the value
                element.value = '';
                console.log("Cleared the form")
            }
        }
    } else {
        console.log('Form not found');
    }
}

async function checkInvalidPreviousRequests() {
  
  try {
    const { data, error } = await supabase.from('Requests').select('Date').eq('donor_name', storedEmail);
    
    if (error) {
      console.log("Failed to fetch previous requests: ", error.message)
    } else {
      const previousRequests = data;
      const invalidRequests = [];

      // Check each previous request's date
      previousRequests.forEach((request) => {
        const requestDate = new Date(request.Date);
        const diffInMs = new Date().getTime() - requestDate.getTime();
        const diffInDays = diffInMs / (1000 * 3600 * 24);

        if (diffInDays > 1) {
          invalidRequests.push(request);
        }
      });

      // Display a message if there are invalid requests
      if (invalidRequests.length > 0) {
        const invalidRequestsMessage = document.createElement('div');
        invalidRequestsMessage.innerHTML = 'Note: Your previous requests from ' + invalidRequests.map((request) => request.Date).join(', ') + ' are no longer valid due to the date difference.';
        invalidRequestsMessage.style.color = 'orange';
        document.getElementById('error-container').appendChild(invalidRequestsMessage);
      }
    }
  } catch (e) {
    console.log("Failed to fetch previous requests: ", e.message)
  }
}