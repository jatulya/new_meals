//let uname;
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
        .from('Donor')
        .delete()
        .eq('Email', storedEmail); // Replace 'user_id' and '123' with your actual identifier

      if (error) {
        throw error;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const userID = user.id;
      console.log(user)
      console.log(userID)
      /*const msg = await supabase.auth.deleteUser(userID)
      if(msg.error){
          console.log('User Not deleted');
      }
      else{
          window.location.href = 'index.html';
      }*/


      console.log('Profile deleted successfully');
    } catch (error) {
      console.error('Error deleting profile:', error.message);
    }
  }
});

function redirectToAnotherPage() {
  // Replace 'another-page.html' with the actual URL of the page you want to navigate to
  window.location.href = 'donorupdate.html';
}

//console.log("FRom supabase.int")



document.addEventListener('DOMContentLoaded', async () => {
  await fetchUserProfile();
});
async function fetchUserProfile() {
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

    if (data) {
      displayUserProfile(data);
    } else {
      console.log('User profile not found.');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
  }
}

function displayUserProfile(profileData) {
  const profileDetailsContainer = document.getElementById('profiledetails');

  if (profileData) {
    const profileHtml = `
            <p>${profileData.Name}</p>
            <p>Address: ${profileData.Address}</p>
            <p>Ph_no: ${profileData.Ph_no}</p>
            <p>Email: ${profileData.Email}</p>
            <p>Restaurant or Individual: ${profileData.RI}</p>
            
        `;
    profileDetailsContainer.innerHTML = profileHtml;
  } else {
    profileDetailsContainer.innerHTML = '<p>User profile not found.</p>';
  }
}


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
      .select('Date, charity_name, Item, Quantity')
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
                    </div>
            </div>
            </div>
           <br>
        `;
  console.log('ok');
  profileDetailsContainer.appendChild(recordDiv);
  console.log('completed');
}



// Call the fetchUserProfile function when the page is loaded

document.addEventListener('DOMContentLoaded', fetchUserActivity);
function redirectToLogin() {
  window.location.href = "index.html";
}

