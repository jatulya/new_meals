

//console.log("FRom supabase.int")

// Fetch user profile data from Supabase
async function fetchUserProfile() {
    // Assume you have a user ID, replace '123' with the actual user ID
    console.log(storedEmail);

    try {
        const { data, error } = await supabase
            .from('Charity_Organisation')
            .select('Name, Address, Ph_no, Email')
            .eq('Email', storedEmail)
            .single();

        if (error) {
            throw error;
        }

        // Display user profile details on the page
        displayUserProfile(data);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
    }
}

// Display user profile details on the page
function displayUserProfile(profileData) {
    const profileDetailsContainer = document.getElementById('profiledetails');

    if (profileData) {
        // Construct HTML to display user profile details
        const profileHtml = `
            <p>${profileData.Name}</p>
            <p>Address: ${profileData.Address}</p>
            <p>Ph_no: ${profileData.Ph_no}</p>
            <p>Email: ${profileData.Email}</p>
            
            
        `;

        // Set the HTML content of the profile details container
        profileDetailsContainer.innerHTML = profileHtml;
    } else {
        profileDetailsContainer.innerHTML = '<p>User profile not found.</p>';
    }
}





async function fetchDonationRequests() {
    var st='No';
    try {
        const { data, error } = await supabase
            .from('Requests')
            .select('donor_name, Date, Quantity, food_type, Address')
            .eq('Status',st)
        
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
document.addEventListener('DOMContentLoaded', fetchUserProfile);
document.addEventListener('DOMContentLoaded', fetchDonationRequests);


function redirectToLogin() {
    window.location.href = 'index.html';
  }
