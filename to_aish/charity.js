document.addEventListener('DOMContentLoaded', () => {
    // Assume you have a Supabase client instance called 'supabase'
    //const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_API_KEY');

    const deleteProfileButton = document.getElementById('deleteprofile');

    deleteProfileButton.addEventListener('click', () => {
        // Ask for confirmation
        const isConfirmed = confirm('Are you sure you want to delete your profile?');

        if (isConfirmed) {
            // Perform the deletion
            deleteProfile();
        }

    });

    // Function to delete the profile record from the Supabase table

    async function deleteProfile() {
        try {
            // Assume 'profiles' is the name of your Supabase table
            const { data, error } = await supabase
                .from('Charity_Organisation')
                .delete()
                .eq('Email', storedEmail); // Replace 'user_id' and '123' with your actual identifier

            if (error) {
                throw error;
            }

            console.log('Profile deleted successfully');
        } catch (error) {
            console.error('Error deleting profile:', error.message);
        }
    }
});

function redirectToAnotherPage1() {
    // Replace 'another-page.html' with the actual URL of the page you want to navigate to
    window.location.href = 'charityupdate.html';
}


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
    var st = 'No';
    try {
        const { data, error } = await supabase
            .from('Requests')
            .select('donor_name, Date, Quantity, food_type, Address')
            .eq('Status', st)

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
                <button type="button" class="btn btn-primary status-buttons declinebtnclass">Decline</button>
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

            const declineBtns = document.querySelectorAll('.declinebtnclass');

            // Attach event listener to each 'acceptbtn'
            acceptBtns.forEach((btn) => {
                btn.addEventListener('click', addToOrderTable);
                console.log("Added event listener to an 'acceptbtn'");

                declineBtns.forEach((btn) => {
                    btn.addEventListener('click', declineData);
                    console.log("Added event listener to an 'declinebtn'");


                });
                console.log('end');
            })
                .catch(error => {
                    console.error('Error fetching donation requests:', error.message);
                });
        })

    function declineData(event) {
        // Find the data container with the specified uniqueId
        const dataContainer = event.target.closest('.requests');

        // Check if the data container exists before attempting to remove it
        if (dataContainer) {
            // Remove the data container from the DOM
            dataContainer.remove();
        } else {
            console.warn(`Data container not found.`);
        }
    }

    async function addToOrderTable(event) {
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
})

async function fetchUname() {
    try {
        const { data, error } = await supabase
            .from('Charity_Organisation')
            .select('Name')
            .eq('Email', storedEmail)
            .single();
        console.log(data, 'fetchuname');
        console.log(data.Name)
        var uname = data.Name;

        if (error) {
            throw error;
        }

        if (data) {
            console.log(uname, 'got it');
        } else {
            console.log('User profile not found.');
        }
    }

    catch (error) {
        console.error('Error fetching user profile:', error.message);
    }
    console.log(uname, 'available here')
    return uname;
}

async function fetchUserActivity() {
    const uname1 = await fetchUname();
    console.log(uname1, 'from fetchuseractivity')


    try {
        const { data, error } = await supabase
            .from('Orders')
            .select('Date, donor_name, Item, Quantity')
            .eq('charity_name', uname1)

        console.log(data)

        if (error) {
            throw error;
        }

        data.forEach((record, index) => {
            console.log('Processing record:', record);
            displayUserActivity(record);
        });


    } catch (error) {
        console.error('Error fetching user profile:', error.message);
    }
}

function displayUserActivity(record) {
    const profileDetailsContainer = document.getElementById('activity');
    const recordDiv = document.createElement('div');
    recordDiv.innerHTML = `<div class='activity-card'>
              <div>
                  <p>Date: ${record.Date}</p>
                      <div >
                        <p>Donor Name : ${record.donor_name}</p>
                        <p>Item: ${record.Item}</p> 
                        <p>Quantity:${record.Quantity}</p>  
                      </div>
              </div>
              </div>
             <br>
          `;
    console.log('ok');
    profileDetailsContainer.appendChild(recordDiv);
    console.log('completed');
}


document.addEventListener('DOMContentLoaded', fetchUserActivity);
function redirectToLogin() {
    window.location.href = "index.html";
}