document.addEventListener('DOMContentLoaded', () => {
  //event.preventDefault();
  const updateButton = document.getElementById('updatebtn');
  console.log("Entered the DOM")
  updateButton.addEventListener('click', handleFormSubmit);
});

async function handleFormSubmit() {
  // Gather data from the form
  console.log("Inside the asynch function");
  //fetching the data from Donor Table
  try {
      const Name1 = document.getElementById('profilename').value;
      const Password1 = document.getElementById('password1').value;
      const Ph_no1 = document.getElementById('exampleInputText1').value;
      const Address1 = document.getElementById('exampleInputText2').value;
      // const RI = document.getElementById('exampleusertype').value;
      console.log("Gathered the data from the form")
      const updateData = {};
      updateData['Name'] = Name1;
      updateData['Password'] = Password1;
      updateData['Ph_no'] = Ph_no1;
      updateData['Address'] = Address1;
      console.log("Gathered the data from the form")
      const { error } = await supabase.from('Donor').update(updateData).eq('Email', storedEmail)
      if (error) {
          console.log("Failed to insert: ", error);
      }
      else {
          console.log("Data successfully inserted to Requests..", data);

      }
  }
  catch (e) { console.log("Failed to fetch from donor..") }

  redirectToDonorProfile();
}

function redirectToDonorProfile() {
  alert("Profile Updated!");
  window.location.href = 'donor.html';
}