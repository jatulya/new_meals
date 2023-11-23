var dellist=[{
    Name2:'KFC',
    To2:'Thanal Oldage Home',
    City2:'Kochi',
    Quantity2:'12kg'

},{
    Name2:'Thallumala',
    To2:'Navodya Welfare Home',
    City2:'Kochi',
    Quantity2:'7kg'

}]
console.log(dellist);


function renderlist2(){

    const storedReqlist2 = localStorage.getItem('dellist');

  // Check if reqlist exists in local storage
  if (storedReqlist2) {
    // Parse the stored JSON string back into an array
    dellist = JSON.parse(storedReqlist2);
  }

  console.log(dellist);
    let delhtml='';
    for(let i=0;i<dellist.length;i++){
        const delObj=dellist[i];
        const Name2=delObj.Name2;
        const To2=delObj.To2;
        const City2=delObj.City2;
        const Quantity2=delObj.Quantity2;


        const html2=` <div class="delivery-requestdetails">
        <p>From : ${Name2}</p>
        <p>To : ${To2}</p>
        <div class="row">
            <div class="col-4">
                <p>Quantity : ${Quantity2}</p>
                <p>Type : Non Veg</p>
            </div>
            <div class="col-4">
                <p>${City2}</p>
                <p>Date : 19/11/2023</p>
            </div>
        </div>
        
        
    </div>
    <div class="delivery-requestbtn button-allign">
        <div class="btn-group status-buttons" role="group" aria-label="Basic example" >
            <button type="button" class="btn btn-primary status-buttons">Accept</button>
            <button type="button" class="btn btn-primary status-buttons" onclick="removeItem2(${i}); renderlist2();
                    ">Decline</button>
          </div>
    </div>
                ` 
        ;
        delhtml+=html2;
    }
    document.querySelector('.js-delrequest').innerHTML=delhtml;
}

renderlist2();



function removeItem2(index) {
    dellist.splice(index, 1);
    localStorage.setItem('dellist', JSON.stringify(dellist));
}


function senddelreq(){
    const nameinpElement=document.querySelector('.js-donor2');
    const inputname=nameinpElement.textContent;

    const toinpElement=document.querySelector('.js-charity');
    const inputname2=toinpElement.textContent;


    const cityinpElement=document.querySelector('.js-city2');
    const inputcity=cityinpElement.textContent;

    const qtyinpElement=document.querySelector('.js-qty2');
    const inputqty=qtyinpElement.textContent;

    dellist.push({
      Name2:inputname,
      To2:inputname2,
      City2:inputcity,
      Quantity2:inputqty

    });
    localStorage.setItem('dellist', JSON.stringify(dellist));
    console.log(dellist);

    qtyinpElement.value='';
    renderlist2();
 }
