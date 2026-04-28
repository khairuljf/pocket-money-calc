


// Select query
document.getElementById('addMoneyform').addEventListener('submit', addMoneyCb);

// Reduce money
document.querySelector("#reduceMoneyForm").addEventListener('submit', reduceMoney);

// Reset memoery 
document.getElementById('resetData').addEventListener('click', resetData);

// add money callback function
function addMoneyCb(e){
    let inputMoney = document.getElementById('addMoney').value;
    inputMoney = Number(inputMoney);
    let validatemoney = addMoneyValidation(inputMoney);
    if(validatemoney){
        if(localStorage.getItem("MyMoney") === null){
            localStorage.setItem("MyMoney", inputMoney);
        }else{
            var TotalMoney =  Number(localStorage.getItem('MyMoney'));
            var addmoney = TotalMoney + inputMoney;
            localStorage.setItem("MyMoney", addmoney);
        }
    }
    document.getElementById('addMoneyform').reset();
    getCurrentBalance();

    e.preventDefault();
}

// reduce money callback funtion
function reduceMoney(e){
    let reduceAmmout = Number(document.getElementById('reduceMoney').value); 

    // Negative value to positive
    if((reduceAmmout < 0)){
        reduceAmmout = Math.abs(reduceAmmout);
    }
    let reduceReson = document.getElementById('investReason').value;
    
    let time = new Date();
    let fulltime = time_format(time);
    let year = time.getFullYear();
    let month = get_month(time);
    let date = time.getDate();
    fulldate = date + '-'+ month +'-'+ year;
    var reduceList= {
        id:getid(),
        rDate: fulldate,
        rTime: fulltime,
        reason: reduceReson,
        ammout: reduceAmmout,
    }
    
    if(localStorage.getItem("singleItem") === null){
        let reduceitems = [];
        let TotalMoney =  Number(localStorage.getItem('MyMoney'));
        let addmoney = TotalMoney - reduceAmmout;

        if(addmoney<0){
            alert('Sorry, value must be less than current balance ');
            
        }else{
            reduceitems.push(reduceList);
            localStorage.setItem("singleItem", JSON.stringify(reduceitems));
            localStorage.setItem("MyMoney", addmoney);
        }
    } else{
        let reduceitems = JSON.parse(localStorage.getItem("singleItem"));
        let TotalMoney =  Number(localStorage.getItem('MyMoney'));
        let addmoney = TotalMoney-reduceAmmout;
      

        if(addmoney<0){
            alert('Sorry, value must be less than current balance ');
            
        }else{
            reduceitems.push(reduceList);
            localStorage.setItem("singleItem", JSON.stringify(reduceitems));
            localStorage.setItem("MyMoney", addmoney);
        }
            
    }
    getCurrentBalance();
    fetchItemCustom();
    document.getElementById('reduceMoneyForm').reset();
    e.preventDefault();
}

// Reset Data callback function
function resetData(){
    let confirmation = confirm('Are you sure, You want to delete all data?');
    var  removeInfo = document.getElementById('resetinfo');

    if(confirmation){
        localStorage.removeItem("MyMoney"); 
        localStorage.removeItem("singleItem");
        if(localStorage.getItem("MyMoney") === null && localStorage.getItem("singleItem") == null ){
            document.getElementById('loadMoreItem').style.display = 'none';
            removeInfo.innerHTML='Data has been removed successfully';   
           function removeMessage() {
            removeInfo.innerHTML='';
            }
        }
    
        setInterval(removeMessage, 1000);
        document.getElementById('listTable').style.display = 'none';
        document.getElementById("orderchange").style.display = 'none';
        getCurrentBalance();
        fetchItemCustom();
        
        
    }
}


//Unique Id generator 
function getid(){
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

// Validation 
function addMoneyValidation(data){

    let myaccount = Number(localStorage.getItem('MyMoney'));
   
    if(localStorage.getItem("MyMoney") === null){
        let check =  data<0?false:true;
        if(check){
            return check;
        }else{
            alert("Please enter positive value");
            return check;
        }
    }else if(data < 0){
        if(myaccount+data<0){
            alert("Sorry, value must be less than current balance");
            return false
        }
        else{
            return true;
        }
    }else{
        return true;
    }
}

// Get all item list callback cb
function fetchItem(order){
    let itemlist = document.getElementById('itemlist');
    let itemTable = document.getElementById('listTable');
    itemlist.innerHTML = '';
    let allItems = JSON.parse(localStorage.getItem("singleItem"));
    
    order==1?allItems.reverse(): allItems;
    //checkOrder(allItems)
    //allItems.reverse();

   
    let count = 0;

    if(localStorage.getItem("MyMoney") === null && localStorage.getItem("singleItem") === null ){
        itemTable.style.display = 'none';        
    }else {
        itemTable.style.display = 'block';
    }

    for(item in allItems){
        let date = allItems[item].rDate;
        let time = allItems[item].rTime;
        let reson = allItems[item].reason;
        let ammount = allItems[item].ammout;

        //console.log(allItems[item]);
        
        itemlist.innerHTML += ` <tr>
        <th scope="row">${count}</th>
        <td>${date}</td>
        <td>${time}</td>
        <td>${reson}</td>
        <td>-${ammount}/-</td>
      </tr>`;
      count++;
    }
    let loadMoreItem = document.getElementById('loadMoreItem').style.display = 'none';

}

// fetch Targted item item
function fetchItemCustom(order){
    
    let itemlist = document.getElementById('itemlist');
    let itemTable = document.getElementById('listTable');
    itemlist.innerHTML = '';
    let allItems = JSON.parse(localStorage.getItem("singleItem"));
   
    document.getElementById('loadMoreItem').style.display = 'none';
    
    
    // Reverse item
    order==1?allItems.reverse(): allItems;

    let count = 1;
    
    
    if(localStorage.getItem("MyMoney") == null || localStorage.getItem("singleItem") == null ){
        itemTable.style.display = "none";
        document.getElementById('listTable').style.display = "none";
        document.getElementById("orderchange").style.display = "none"; 
        allItems=[]      
    }else {
        itemTable.style.display = 'block';
        document.getElementById("orderchange").style.display = "block"; 
    }

    for(item in allItems){
        let id = allItems[item].id;
        let date = allItems[item].rDate;
        let time = allItems[item].rTime;
        let reson = allItems[item].reason;
        let ammount = allItems[item].ammout;

        //console.log(allItems[item]);
        
        itemlist.innerHTML += ` <tr>
        <th scope="row">${count}</th>
        <td>${date}</td>
        <td>${time}</td>
        <td>${reson}</td>
        <td>-${ammount}/-</td>
        <td><button value=${id} ${onclick=myfunc}>X</button></td>
      </tr>`;
      count++;
      if(count==12){
          break;
      }
    }
    if(allItems.length>10){
        document.getElementById('loadMoreItem').style.display = 'block';
    }

}


function myfunc(e){
    let id = e.target.value;
}

// Onload Get Current Balance
function onload_funstions(){
    getCurrentBalance();
    fetchItemCustom();
}

// order change 

 function checkOrder( getOrder ){
     // Get the checkbox
  var checkBox = document.getElementById("orderListCheck");

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true){ 
    fetchItemCustom(1);
  } else {
    fetchItemCustom(0);
  }
}


function getCurrentBalance(){
   let getmyaccount = localStorage.getItem('MyMoney');
   let showBalance = document.getElementById('current-account');
   if(getmyaccount == null || getmyaccount == 0 ){
    showBalance.innerHTML = 0 +'/-';
    let formId = document.getElementById('reduceMoneyForm');
    var elements = formId.elements;
     for(let i=0; i<elements.length; i++){
        elements[i].setAttribute("disabled", "");
     }
     //document.getElementById('resetData').setAttribute("disabled", "");
     document.getElementById('listTable').style.display  = 'none';
     document.getElementById('orderchange').style.display  = 'none';
 
   } else{
            let formId = document.getElementById('reduceMoneyForm');
            var elements = formId.elements;
            for(let i=0; i<elements.length; i++){
                elements[i].removeAttribute("disabled", "");
        }
        //document.getElementById('resetData').removeAttribute("disabled", "");
    showBalance.innerHTML = getmyaccount + '/-';
   }   
}

// Get month callback function
var get_month = function(dt){
    mlist = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
      return mlist[dt.getMonth()];
    };

// Get full time format
function time_format(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        if(minutes<10){
            minutes = '0'+minutes;
        }
        var strTime = hours + ':' + minutes + ':'+ seconds + ' '+ ampm;
        return strTime;
      }







