async function fetchUserProfile() {
    // Assume you have a user ID, replace '123' with the actual user ID
    console.log(storedEmail);

    try {
        const { data, error } = await supabase
            .from('Donor')
            .select('Name, Address, Ph_no, Email, RI')
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
            <p>Restaurant or Individual: ${profileData.RI}</p>
            
        `;

        // Set the HTML content of the profile details container
        profileDetailsContainer.innerHTML = profileHtml;
    } else {
        profileDetailsContainer.innerHTML = '<p>User profile not found.</p>';
    }
}

// Call the fetchUserProfile function when the page is loaded
document.addEventListener('DOMContentLoaded', ()=>
{
    fetchUserProfile(); 
    fetchUserActivity();
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

async function deleteProfile() {
    try {
      const { data, error } = await supabase
        .from('Donor')
        .delete()
        .eq('Email', storedEmail); // Replace 'user_id' and '123' with your actual identifier

      if (error) {
        throw error;
      }
      const { data: { user } } = await supabase.auth.getUser();
      const userID = user.id ;
      console.log(user, " : ", userID)
      
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
      .from('Donor')
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
      .select('Date, charity_name, Item, Quantity, Delivery_status')
      .eq('donor_name', uname1)

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
                      <p>Charity Org. : ${record.charity_name}</p>
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

function redirectToAnotherPage() {
  window.location.href = 'donorupdate.html';
}

function redirectToLogin() {
    window.location.href = "index.html";
}

