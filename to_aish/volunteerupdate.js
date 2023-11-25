document.addEventListener('DOMContentLoaded', function () {
    const updateButton = document.getElementById('updatebtn');
    console.log("Entered the DOM")
    updateButton.addEventListener('click', handleFormSubmit);
});

async function handleFormSubmit() {
    // Gather data from the form
    console.log("Inside the asynch function")
    //fetching the data from Donor Table
    try {
        const Name1 = document.getElementById('profilename').value;
        const Password1 = document.getElementById('password1').value;
        const Ph_no1 = document.getElementById('exampleInputText1').value;
        const Address1 = document.getElementById('exampleInputText2').value;
        const DoB1 = document.getElementById('dateofbirth').value;
        const Area1 = document.getElementById('examplearea').value;
        const From1 = document.getElementById('exampletimefrom').value;
        const To1 = document.getElementById('exampletimeto').value;
        console.log("Gathered the data from the form");

        const updateData = {};
        updateData['Name'] = Name1;
        updateData['Password'] = Password1;
        updateData['Ph_no'] = Ph_no1;
        updateData['Address'] = Address1;
        updateData['DoB'] = DoB1;
        updateData['Area_avail'] = Area1;
        updateData['From'] = From1;
        updateData['To'] = To1;
        //const { error } = await supabase.from('Volunteers').update({ Name: Name1, Password: Password1, Ph_no: Ph_no1, Address: Address1, DoB: DoB, Area: Area, From: From, To: To }).eq('Email', storedEmail)
        const { error } = await supabase.from('Volunteers').update(updateData).eq('Email', storedEmail)
        if (error) {
            console.log("Failed to insert data: ", error)
        }
        else {
            console.log("Data successfully inserted to Requests..", data)
        }
    }
    catch (e) { console.log("Failed to fetch from donor..") }
    redirectToVolunteerProfile();
}

function redirectToVolunteerProfile() {
    // Replace 'another-page.html' with the actual URL of the page you want to navigate to
    alert("Profile Updated!");
    window.location.href = 'volunteer.html';
}