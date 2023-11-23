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
  /*
  async function fetchDonationRequests() {
    try {
        const { data, error } = await supabase
            .from('Requests')
            .select('donor_name, Date, Quantity, food_type, Address')
        
        if (error) {
            throw error;
        }
        console.log('Retrieved data:', data);

        console.log('no error till now');
        // Display user profile details on the page
        data.forEach((record, index) => {
            console.log('Processing record:', record);
            displayRequests(record);
        });

    } catch (error) {
        console.error('Error fetching requests:', error.message);
    }
}
// Display request details on the page
function displayRequests(record) {
    console.log('running display');
    const donationReqContainer = document.getElementById('donate-card');

        const recordDiv = document.createElement('div');
        recordDiv.innerHTML = `
            <div>
                <p class="js-donor2">Donor: ${record.donor_name}</p>
                <div class="row">
                    <div class="col-4">
                        <p class="js-qty2">Quantity : ${record.Quantity}</p>
                        <p>Type : ${record.food_type}</p>
                    </div>
                    <div class="col-4">
                        <p class="js-city2">Location: ${record.Address}</p> 
                        <p>Date:${record.Date}</p>           
                    </div>
                </div>
            </div>
            <div class="donation-requestbtn button-allign">
                <div class="btn-group status-buttons" role="group" aria-label="Basic example" >
                    <button type="button" class="btn btn-primary status-buttons" >Accept</button>
                    <button type="button" class="btn btn-primary status-buttons" >Decline</button>
                </div>
            </div>
        `;
        console.log('ok');
        donationReqContainer.appendChild(recordDiv);
        console.log('completed');

}
// Call the fetchUserProfile function when the page is loaded
//document.addEventListener('DOMContentLoaded', fetchUserProfile);
document.addEventListener('DOMContentLoaded', fetchDonationRequests);
*/