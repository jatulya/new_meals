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
                .from('Volunteers')
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


function redirectToVolUpdate() {
    // Replace 'another-page.html' with the actual URL of the page you want to navigate to
    window.location.href = 'volunteerupdate.html';
}


//console.log("FRom supabase.int")

// Fetch user profile data from Supabase
async function fetchUserProfile() {
    // Assume you have a user ID, replace '123' with the actual user ID
    console.log(storedEmail);

    try {
        const { data, error } = await supabase
            .from('Volunteers')
            .select('Name, DoB, Address, Ph_no, Email, Area_avail, From, To')
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
            <h4>${profileData.Name}</h4>
            <p>Date of Birth: ${profileData.DoB}</p>
            <p>Address: ${profileData.Address}</p>
            <p>Ph_no: ${profileData.Ph_no}</p>
            <p>Email: ${profileData.Email}</p>
            <p>Area available: ${profileData.Area_avail}</p>
            <p>Available from: ${profileData.From}</p>
            <p>Available till: ${profileData.To}</p>
            
            
        `;

        // Set the HTML content of the profile details container
        profileDetailsContainer.innerHTML = profileHtml;
    } else {
        profileDetailsContainer.innerHTML = '<p>User profile not found.</p>';
    }
}

async function fetchDeliveryRequests() {
    var st2 = 'Noone';
    var st = 'No';
    try {
        const { data, error } = await supabase
            .from('Orders')
            .select('*')
            .eq('volunteer', st2)


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
    const donationReqContainer = document.getElementById('del-card');

    const recordDiv = document.createElement('div');
    recordDiv.innerHTML = `
        <div class="delivery-requestdetails">
        <p>From : ${record.donor_name}</p>
        <p>To : ${record.charity_name}</p>
        <div class="row">
            <div class="col-4">
                <p>Quantity : ${record.Quantity}</p>
                <p>Type: ${record.food_type}</p>
            </div>
            <div class="col-4">
                <p>Location:${record.Address}</p>
                <p>Date : ${record.Date}</p>
            </div>
        </div>
        
        
    </div>
    <div class="delivery-requestbtn button-allign">
        <div class="btn-group status-buttons" role="group" aria-label="Basic example" >
            <button type="button" class="btn btn-primary status-buttons" onclick="toggleButtons()">Accept</button>
            <button type="button" class="btn btn-primary status-buttons" >Decline</button>
          </div>
          

    </div>
        `;
    console.log('ok');
    donationReqContainer.appendChild(recordDiv);
    console.log('completed');

}




async function updateData(message, OrderID) {
    try {

        // Replace 'your_table_name' with the name of your Supabase table
        const { error } = await supabase
            .from('Orders')
            .update([
                {
                    // Specify the conditions to update the data (e.g., where clause)
                    // For example, update the 'column_to_update' to 'new_value'
                    Delivery_status: message,
                }
            ])
            .eq('O_id', OrderID)


        if (error) {
            throw error;
        }

        console.log('Data updated successfully:');
    } catch (error) {
        console.error('Error updating data:', error.message);
    }
}


async function fetchUname() {
    try {
        const { data, error } = await supabase
            .from('Volunteers')
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
            .select('O_id, Date, donor_name, charity_name, Item, Quantity, Delivery_status')
            .eq('volunteer', uname1)

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
                  <p>Date : ${record.Date}</p>
                      <div >
                      <p>OrderID : ${record.O_id}</p>
                       <p>Donor : ${record.donor_name}</p>
                        <p>Charity Org. : ${record.charity_name}</p>
                        <p>Item: ${record.Item}</p> 
                        <p>Quantity:${record.Quantity}</p> 
                        <p>Current Delivery Status :  ${record.Delivery_status}</p>
                      </div>
                      <div class="top">
                            <p>Update delivery Status : </p>
                            <select id="who1" class="form-select" aria-label="Default select example" onchange="updateData(this.value, ${record.O_id})">
                                <option value="" disabled selected>Select an option</option>
                                <option value="Heading to pickup location">Heading to pickup location</option>
                                <option value="Picked up..to charity org">Picked up..to charity org</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                      </div>
              </div>
              </div>
             <br>
          `;


    console.log('ok', record.O_id);
    profileDetailsContainer.appendChild(recordDiv);
    console.log('completed');
}




// Call the fetchUserProfile function when the page is loaded
document.addEventListener('DOMContentLoaded', fetchUserProfile);
document.addEventListener('DOMContentLoaded', fetchDeliveryRequests);
document.addEventListener('DOMContentLoaded', fetchUserActivity);

function redirectToLogin() {
    window.location.href = "index.html";
}


