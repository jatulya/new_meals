console.log("from request.js beginning")
var reqlist=[{
  Name:'Zaroob Restaurant',
  City:'Kochi',
  Quantity:'12kg'
  
},{
  Name:'Arabian Palace',
  City:'Kochi',
  Quantity:'6kg'
}]

console.log(reqlist);

document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('formbtn');
    submitButton.addEventListener('click', handleFormSubmit);
  });
  
  async function handleFormSubmit() {
    // Gather data from the form
    const foodType = document.getElementById('food_type').value;
    const numPeople = document.getElementById('numPeople').value;
    const foodWeight = document.getElementById('foodWeight').value;
    const foodItems = document.getElementById('foodItems').value;
    const foodTime = document.getElementById('foodTime').value;
    
    // Insert data into Supabase table (replace 'your_table_name' with your actual table name)
    const { data, error } = await supabase.from('Requests').insert([
      {
        food_type:foodType,
        Quantity:foodWeight,
        Items: foodItems,
        Date: foodTime,
        D_id : 8,
        Address: 'Kochi'
      },
    ]);
  
    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted successfully:', data);
      const nameinputElement=document.querySelector('.js-name');
    const inpname=nameinputElement.textContent;

    const cityinputElement=document.querySelector('.js-city');
    const inpcity=cityinputElement.textContent;

    const qtyinputElement=document.querySelector('.js-input2');
    const inpqty=qtyinputElement.value;

    reqlist.push({
        Name:inpname,
        City:inpcity,
        Quantity:inpqty  
    });
    
    localStorage.setItem('reqlist', JSON.stringify(reqlist));
    console.log(reqlist);
    qtyinputElement.value='';
    renderlist();
 }
  }
function renderlist(){
  
  const storedReqlist = localStorage.getItem('reqlist');

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
  
      console.log("Fetched for charity")
      const html=`<div><p class="js-donor2">Donor: ${Name}</p>
      <div class="row">
          <div class="col-4">
              <p class="js-qty2">Quantity : ${Quantity}</p>
              <p>Type : Non Veg</p>
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
      console.log("Added to the charity")
  }
  document.querySelector('.js-request').innerHTML=reqhtml;
}

renderlist();

function removeItem(index) {
  reqlist.splice(index, 1);
  localStorage.setItem('reqlist', JSON.stringify(reqlist));
}


