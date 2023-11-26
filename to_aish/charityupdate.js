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
        const Names = document.getElementById('profilename').value;
        const Password1 = document.getElementById('password1').value;
        const Ph_no1 = document.getElementById('exampleInputText1').value;
        const Address1 = document.getElementById('exampleInputText2').value;
        console.log(Names)
        const updateData = {};
        updateData['Name'] = Names;
        updateData['Password'] = Password1;
        updateData['Ph_no'] = Ph_no1;
        updateData['Address'] = Address1;
        console.log("Gathered the data from the form")
        //const { error } = await supabase.from('Charity_Organisation').update({ Name: Names, Password: 'blahblah1', Ph_no: '141414', Address: 'bla1h' }).eq('Email', storedEmail)
        const updateFields = {};
        for (const field in updateData) {
            if (!(updateData[field] === '')) {
                updateFields[field] = updateData[field];
            }
        }
        const { error } = await supabase.from('Charity_Organisation').update(updateFields).eq('Email', storedEmail)

        if (error) {
            console.log("Failed to insert data: ", error)
        }
        else {
            console.log("Data successfully inserted to Requests..", data)

        }
    }
    catch (e) { console.log("Failed to fetch from donor..") }

    redirectToCharityProfile()
}

function redirectToCharityProfile() {
    // Replace 'another-page.html' with the actual URL of the page you want to navigate to
    alert("Profile Updated!");
    console.log("hi");
    window.location.href = 'charity.html';
}