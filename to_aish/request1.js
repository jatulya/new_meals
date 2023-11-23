
console.log("from request.js beginning")
var reqlist=[{
  Name:'Zaroob Restaurant',
  City:'Kochi',
  Quantity:'12kg',
  FoodType: 'Veg'
},{
  Name:'Arabian Palace',
  City:'Kochi',
  Quantity:'6kg',
  FoodType: 'Veg'
}]

console.log("Created reqlist")
document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.getElementById('formbtn');
  console.log("Loaded register.js from donor/charity");
  submitButton.addEventListener('click', handleFormSubmit);
});

function renderlist(){
  
  const storedReqlist = localStorage.getItem('reqlist');
  console.log("stored it in local storage")
// Check if reqlist exists in local storage
  if (storedReqlist) {
  // Parse the stored JSON string back into an array
  reqlist = JSON.parse(storedReqlist);
  }
  console.log(reqlist);

  let reqhtml='';
  for(let i=0;i<reqlist.length;i++){
      const reqObj=reqlist[i];
      const Name=reqObj.Name;
      const City=reqObj.City;
      const Quantity=reqObj.Quantity;
      const FoodType=reqObj.FoodType;
      console.log("Fetched data for adding..");
      const html=`<div><p class="js-donor2">Donor: ${Name}</p>
      <div class="row">
          <div class="col-4">
              <p class="js-qty2">Quantity : ${Quantity}</p>
              <p>Type :${FoodType}</p>
          </div>
          <div class="col-4">
              <p class="js-city2">${City}</p>
              
          </div>
      </div>
      </div>
      <div class="donation-requestbtn button-allign">
                  <div class="btn-group status-buttons" role="group" aria-label="Basic example" >
                      <button type="button" class="btn btn-primary status-buttons" onclick="senddelreq();">Accept</button>
                      <button type="button" class="btn btn-primary status-buttons" onclick="removeItem(${i}); renderlist();
                      ">Decline</button>
                    </div>
              </div>
              ` 
      ;
      reqhtml+=html;
      console.log("Adding it to the charity..");
  }
  document.querySelector('.js-request').innerHTML=reqhtml;
}

renderlist();

function removeItem(index) {
  reqlist.splice(index, 1);
  localStorage.setItem('reqlist', JSON.stringify(reqlist));
}

async function handleFormSubmit() {
  // Gather data from the form
  const foodType = document.getElementById('food_type').value;
  const foodWeight = document.getElementById('foodWeight').value;
  const foodItems = document.getElementById('foodItems').value;
  const foodTime = document.getElementById('foodTime').value;
  const inpname=document.querySelector('.js-name').textContent;
  const inpcity=document.querySelector('.js-city').textContent;
  
  console.log("Gathered the data");

  const DonorID = await supabase.from('Donor').select('D_id').eq('Name',inpname)
  console.log(DonorID)
  const { error } = await supabase.from('Requests').insert([
    {
      food_type : foodType,
      Quantity : foodWeight,
      Items : foodItems,
      Date : foodTime,
    },
  ]);
  
  if (error) {
    console.error('Error inserting data:');
  } else {
    console.log('Data from the form inserted successfully:');

    reqlist.push({
      Name:inpname,
      City:inpcity,
      Quantity:foodWeight,
      FoodType: foodType
    });
    console.log("Got elements and pushed it to the reqlist")
    localStorage.setItem('reqlist', JSON.stringify(reqlist));
    console.log(reqlist);    
    renderlist();
    //clearing the form
    document.getElementById('donateform').reset() 
    console.log("Cleared the form")
  }
}
