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
    var st2='Noone';
    var st='No';
    try {
        const { data, error } = await supabase
            .from('Orders')
            .select('*')
            .eq('volunteer',st2)
                    
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
        recordDiv.innerHTML = ` <div class="delivery">
        <div class="delivery-requestdetails">      
            <div class="row">
                <p  class="js-orderID"> Order ID: ${record.O_id}</p>
                <div class="col-4">
                    <p class="js-donorName">From : ${record.donor_name}</p>
                    <p class="js-orderQty">Quantity : ${record.Quantity}</p>
                    <p class="js-orderFudType">Type: ${record.food_type}</p>
                </div>
                <div class="col-4">
                    <p class="js-CharityName">To : ${record.charity_name}</p>
                    <p class="js-orderAddr">Location:${record.Address}</p>
                    <p class="js-orderDate">Date : ${record.Date}</p>
                </div>
            </div>
        </div>
        <div class="delivery-requestbtn button-allign">
            <div class="btn-group status-buttons" role="group" aria-label="Basic example" >
                <button type="button" class="btn btn-primary status-buttons acceptbtnclass" onclick="toggleButtons()">Accept</button>
                <button type="button" class="btn btn-primary status-buttons declinebtnclass">Decline</button>
            </div>
        </div> <br> <br></div>
        `;
        console.log('ok');
        donationReqContainer.appendChild(recordDiv);
        console.log('completed');

}

document.addEventListener('DOMContentLoaded', () => {
    fetchUserProfile(); 
    fetchUserActivity();
    console.log('start')   

    const deleteProfileButton = document.getElementById('deleteprofile');
    deleteProfileButton.addEventListener('click', () => {
        // Ask for confirmation
        const isConfirmed = confirm('Are you sure you want to delete your profile?');
        if (isConfirmed) {
            // Perform the deletion
            deleteProfile();
        }
    });

    //Move the declaration of acceptBtn inside the event listener
    fetchDeliveryRequests()
        .then(() => {
            // Fetching is completed, now get the acceptbtn
            const acceptBtns = document.querySelectorAll('.acceptbtnclass');
            console.log(acceptBtns);
            // Attach event listener to each 'acceptbtn'
            acceptBtns.forEach((btn) => {
                btn.addEventListener('click', addToOrderTable);
                console.log("Added event listener to an 'acceptbtn'");
            });

            const declineBtns = document.querySelectorAll('.declinebtnclass');
            console.log(declineBtns);
            // Attach event listener to each 'acceptbtn'
            declineBtns.forEach((btn) => {
                btn.addEventListener('click', declineData);
                console.log("Added event listener to an 'declinebtn'");
            });
        console.log('end');
        })
        .catch(error => {
            console.error('Error fetching donation requests:', error.message);
        });
});

function declineData(event) {
    const dataContainer = event.target.closest('.delivery');
    if (dataContainer) {
      dataContainer.remove();
    } else {
      console.warn("Data container not found.");
    }
}

async function addToOrderTable (event) {
    console.log('accept button event listener');

    //fetching from the parent div element in the container
    const detailsContainer = event.target.closest('.delivery');
    
    event.target.disabled = true; //accept btn disabled
    const declineButton = detailsContainer.querySelector('.declinebtnclass');
    declineButton.disabled=true //decline btn disabled

    const OiD = detailsContainer.querySelector('.js-orderID').textContent.split(':')[1].trim();
    try {
        const {data, error}  = await supabase
            .from('Volunteers')
            .select('Name, V_id')
            .eq('Email', storedEmail)
            .single();
            
        if (error) {
            throw error;
        }   
        // Display user profile details on the page
            
        const vname=data.Name;
        const vid=data.V_id;
        console.log(vname);  

        // Add the details to the 'DonorTable' using Supabase
        try {
                const { data, error } = await supabase.from('Orders')
                    .update([
                        {
                            volunteer : vname, 
                        },
                    ]).eq('O_id', OiD);
                if (error) {
                    throw new Error(`Error updating to Order Table: ${error.message}`);
                }
                console.log('Updated to Order Table:', data);
        } 
        catch (error) {
                console.error(error.message);
            }       
    } catch (e) {
        console.error('Error fetching user profile:', e.message);
    }
}

async function deleteProfile() {
    try {
        const { data, error } = await supabase
            .from('Volunteers')
            .delete()
            .eq('Email', storedEmail); 
        if (error) {
            throw error;
        }
        console.log('Profile deleted successfully');
        window.location.href = "index.html"
    } catch (error) {
        console.error('Error deleting profile:', error.message);
    }
}

//user activity
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

async function updateData(message, OrderID) {
    try {
        // Replace 'your_table_name' with the name of your Supabase table
        const { error } = await supabase
            .from('Orders')
            .update([{Delivery_status: message}])
            .eq('O_id', OrderID)

        if (error) {
            throw error;
        }

        console.log('Data updated successfully:');
    } catch (error) {
        console.error('Error updating data:', error.message);
    }
}
function displayUserActivity(record) {
    const profileDetailsContainer = document.getElementById('activity');
    const recordDiv = document.createElement('div');
    recordDiv.innerHTML = 
    `<div class='activity-card'>
              <div>
                  <p>Date: ${record.Date}</p>
                      <div >
                        <p>OrderID : ${record.O_id}</p>
                        <p>Donor : ${record.donor_name}</p>
                        <p>Charity Org. : ${record.charity_name}</p>
                        <p>Item: ${record.Item}</p> 
                        <p>Quantity: ${record.Quantity}kg</p>
                        <p>Current Delivery Status : ${record.Delivery_status}</p>
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

function redirectToLogin() {
    window.location.href = "../index.html";
}

function redirectToVolUpdate() {
    window.location.href = 'volunteerupdate.html';
}
