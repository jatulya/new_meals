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

/*async function fetchDonationRequests() {
    try {
        /*const { data, error } = await supabase
            .from('Requests')
            .select('R_id, donor_name, Date, Quantity, Items, Address')
            .eq('Status','No')
        //new code
        const { data, error } = await supabase
            .from('Requests')
            .select('R_id, donor_name, Date, Quantity, Items, Address')
            .eq('Status', 'No')
            .gte('Date', supabase.fn.now() - '1 day') // Fetch requests within the last day
            .order('Date', { ascending: false }); // Order by date in descending order
        //till here
        if (error) {
            throw error;
        } else {
            console.log('Recent requests:', data);
        }
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
            <p class="js-reqID">Request ID: ${record.R_id}</p>
            <div class="row">
                <div class="col-4">
                    <p class="js-donor2">Donor: ${record.donor_name}</p>
                    <p class="js-city2">Location: ${record.Address}</p> 
                    <p class="js-date2">Date: ${record.Date}</p>
                </div>
                <div class="col-4">
                    <p class="js-qty2">Quantity : ${record.Quantity}</p>
                    <p class="js-item2">Item: ${record.Items}</p>  
                </div>              
            </div>
        </div>
        <div class="donation-requestbtn button-allign">
            <div class="btn-group status-buttons" role="group" aria-label="Basic example" >
                <button type="button" class="btn btn-primary status-buttons acceptbtnclass" >Accept</button>
                <button type="button" class="btn btn-primary status-buttons declinebtnclass">Decline</button>
            </div>
        </div></div>`;
    console.log('ok');
    donationReqContainer.appendChild(recordDiv);
    console.log('completed');
}*/

let requests = [];
let filteredRequests = [];
let currentPage = 0;
let requestsPerPage = 10;

async function fetchDonationRequests() {
  try {
    const { data, error } = await supabase
      .from('Requests')
      .select('R_id, donor_name, Date, Quantity, Items, Address')
      .eq('Status', 'No')
      .gte('Date', supabase.fn.now() - '1 day')
      .order('Date', { ascending: false });

    if (error) {
      throw error;
    } else {
      requests = data;
      filteredRequests = requests.slice();
    }
  } catch (error) {
    console.error('Error fetching requests:', error.message);
  }
}

function displayRequests() {
  const donationReqContainer = document.getElementById('donate-card');
  donationReqContainer.innerHTML = '';
  for (let i = 0; i < Math.min(requestsPerPage, filteredRequests.length); i++) {
    const request = filteredRequests[i];
    const requestDiv = document.createElement('div');
    requestDiv.innerHTML = `
      <div class="requests">
        <div>
          <p class="js-reqID">Request ID: ${request.R_id}</p>
          <div class="row">
            <div class="col-4">
              <p class="js-donor2">Donor: ${request.donor_name}</p>
              <p class="js-city2">Location: ${request.Address}</p> 
              <p class="js-date2">Date: ${request.Date}</p>
            </div>
            <div class="col-4">
              <p class="js-qty2">Quantity : ${request.Quantity}</p>
              <p class="js-item2">Item: ${request.Items}</p>  
            </div>              
          </div>
        </div>
        <div class="donation-requestbtn button-allign">
          <div class="btn-group status-buttons" role="group" aria-label="Basic example" >
            <button type="button" class="btn btn-primary status-buttons acceptbtnclass" >Accept</button>
            <button type="button" class="btn btn-primary status-buttons declinebtnclass">Decline</button>
          </div>
        </div>
      </div>
    `;
    donationReqContainer.appendChild(requestDiv);
  }
  if (filteredRequests.length <= requestsPerPage) {
    document.getElementById('show-more-requests').style.display = 'none';
  } else {
    document.getElementById('show-more-requests').style.display = 'block';
  }
}

function applyFilters() {
  const dietPreference = document.getElementById('diet-preference').value;
  const amountRange = document.getElementById('amount-range').value;
  filteredRequests = requests.filter((request) => {
    if (dietPreference !== 'all' && request.Items !== dietPreference) {
      return false;
    }
    if (amountRange !== 'all') {
      const quantity = parseInt(request.Quantity);
      switch (amountRange) {
        case 'below-10':
          if (quantity >= 10) return false;
          break;
        case '10-20':
          if (quantity < 10 || quantity > 20) return false;
          break;
        case '20-30':
          if (quantity < 20 || quantity > 30) return false;
          break;
        case '30-40':
          if (quantity < 30 || quantity > 40) return false;
          break;
        case '40-50':
          if (quantity < 40 || quantity > 50) return false;
          break;
        case 'above-50':
          if (quantity <= 50) return false;
          break;
      }
    }
    return true;
  });
  currentPage = 0;
  displayRequests();
}

function showMoreRequests() {
  currentPage++;
  displayRequests();
}

document.addEventListener('DOMContentLoaded', async () => {
    fetchUserProfile();
    fetchUserActivity();
    console.log('start')   
  
    try {
      await fetchDonationRequests();
      displayRequests();
      
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
      document.getElementById('apply-filters').addEventListener('click', applyFilters);
      document.getElementById('show-more-requests').addEventListener('click', showMoreRequests);
      console.log('end');
    } catch (error) {
      console.error('Error fetching donation requests:', error.message);
    }
  
    const deleteProfileButton = document.getElementById('deleteprofile');
    deleteProfileButton.addEventListener('click', () => {
      // Ask for confirmation
      const isConfirmed = confirm('Are you sure you want to delete your profile?');   
      if (isConfirmed) {
        // Perform the deletion
        deleteProfile();
      } 
    });
  });
async function addToOrderTable (event) {
    console.log('accept button event listener');

    //fetching from the parent div element in the container
    const detailsContainer = event.target.closest('.requests');
    console.log(detailsContainer);
    event.target.disabled = true;
    const dec = detailsContainer.querySelector('.declinebtnclass')
    dec.disabled = true;
    const reqID = detailsContainer.querySelector('.js-reqID').textContent.split(':')[1].trim();
    const donorName = detailsContainer.querySelector('.js-donor2').textContent.split(':')[1].trim();
    const quantity = detailsContainer.querySelector('.js-qty2').textContent.split(':')[1].trim();
    const foodType = detailsContainer.querySelector('.js-item2').textContent.split(':')[1].trim();
    const address = detailsContainer.querySelector('.js-city2').textContent.split(':')[1].trim();
    const date = detailsContainer.querySelector('.js-date2').textContent.split(':')[1].trim();
    const item = detailsContainer.querySelector('.js-item2').textContent.split(':')[1].trim();
    console.log("Selected text from the selected div element")

    //updating the requests status
    const done = await supabase.from('Requests').update({'Status' : 'Yes'}).eq('R_id', reqID)
    if (done){
        console.log("Updated the request status")    }
    else{
       console.log("Can't update the status")
    }

    try {
        const {data, error}  = await supabase
            .from('Charity_Organisation')
            .select('Name, N_id')
            .eq('Email', storedEmail)
            .single();
            
        if (error) {
            throw error;
        }   
        // Display user profile details on the page
            
        const cname=data.Name;
        const cid=data.N_id;
        console.log(cname);  
        
        // Add the details to the 'DonorTable' using Supabase
        try {
                const { data, error } = await supabase.from('Orders')
                    .upsert([
                        {
                            R_id : reqID,
                            C_id : cid,
                            charity_name : cname,
                            donor_name: donorName,
                            Quantity: quantity,
                            food_type: foodType,
                            Address: address,
                            Date: date,
                            Item : item
                        },
                    ]);
                if (error) {
                    throw new Error(`Error adding to Order Table: ${error.message}`);
                }

                console.log('Added to Order Table:', data);
        } 
        catch (error) {
                console.error(error.message);
            }
        
    } catch (e) {
        console.error('Error fetching user profile:', e.message);
    }
}
//for user activity
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
            .select('Date, donor_name, Item, Quantity, Delivery_status')
            .eq('charity_name', uname1)

        console.log(data)

        if (error) {
            throw error;
        }

        data.forEach((record, index) => {
            console.log('Processing record:', record);
            displayUserActivity(record);
        });
p
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
                        <p>Delivery Status: ${record.Delivery_status}</p>    
                      </div>
              </div>
              </div>
             <br>
          `;
    console.log('ok');
    profileDetailsContainer.appendChild(recordDiv);
    console.log('completed');
}

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
        window.location.href = 'index.html'
    } catch (error) {
        console.error('Error deleting profile:', error.message);
    }
}

function declineData(event) {
    // Find the data container with the specified uniqueId
    const dataContainer = event.target.closest('.requests');
    // Check if the data container exists before attempting to remove it
    if (dataContainer) {
      dataContainer.remove();
    } else {
      console.warn("Data container not found.");
    }
}

function redirectToLogin() {
    window.location.href = "../index.html";
}
function redirectToAnotherPage1() {
    // Replace 'another-page.html' with the actual URL of the page you want to navigate to
    window.location.href = 'charityupdate.html';
}