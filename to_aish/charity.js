//console.log("FRom supabase.int")
async function fetchUserProfile() {
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
        recordDiv.innerHTML = `<div class="requests">
            <div>
                <p class="js-donor2">Donor: ${record.donor_name}</p>
                <div class="row">
                    <div class="col-4">
                        <p class="js-qty2">Quantity : ${record.Quantity}</p>
                        <p class="js-foodtype2">Type : ${record.food_type}</p>
                    </div>
                    <div class="col-4">
                        <p class="js-city2">Location: ${record.Address}</p> 
                        <p class="js-date2">Date:${record.Date}</p>           
                    </div>
                </div>
            </div>
            <div class="donation-requestbtn button-allign">
                <div class="btn-group status-buttons" role="group" aria-label="Basic example" >
                <button type="button" class="btn btn-primary status-buttons acceptbtnclass" >Accept</button>
                <button type="button" class="btn btn-primary status-buttons">Decline</button>
                </div>
            </div></div>
        `;
        console.log('ok');
        donationReqContainer.appendChild(recordDiv);
        console.log('completed');

}
document.addEventListener('DOMContentLoaded', () => {
    fetchUserProfile();
    console.log('start');
    // Move the declaration of acceptBtn inside the event listener
    fetchDonationRequests()
        .then(() => {
            // Fetching is completed, now get the acceptbtn
            const acceptBtns = document.querySelectorAll('.acceptbtnclass');
            console.log(acceptBtns);
            // Attach event listener to each 'acceptbtn'
            acceptBtns.forEach((btn) => {
                btn.addEventListener('click', addToOrderTable);
                console.log("Added event listener to an 'acceptbtn'");
        });
        console.log('end');
    })
    .catch(error => {
        console.error('Error fetching donation requests:', error.message);
    });
})

async function addToOrderTable (event) {
    console.log('accept button event listener');
    const detailsContainer = event.target.closest('.requests');
    
    console.log(detailsContainer);
    event.target.disabled = true;
    const donorName = detailsContainer.querySelector('.js-donor2').textContent.split(':')[1].trim();
    const quantity = detailsContainer.querySelector('.js-qty2').textContent.split(':')[1].trim();
    const foodType = detailsContainer.querySelector('.js-foodtype2').textContent.split(':')[1].trim();
    const address = detailsContainer.querySelector('.js-city2').textContent.split(':')[1].trim();
    const date = detailsContainer.querySelector('.js-date2').textContent.split(':')[1].trim();
    
    // Add the details to the 'DonorTable' using Supabase
    try {
        const { data, error } = await supabase
            .from('Orders')
            .upsert([
                {
                    donor_name: donorName,
                    Quantity: quantity,
                    food_type: foodType,
                    Address: address,
                    Date: date,
                },
            ]);

        if (error) {
            throw new Error(`Error adding to Order Table: ${error.message}`);
        }

        console.log('Added to Order Table:', data);
    } catch (error) {
        console.error(error.message);
    }
}
function redirectToLogin() {
    window.location.href = "index.html";
}