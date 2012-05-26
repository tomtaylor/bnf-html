function layerWrite(id, text) 
{
  if (document.all)
  {
    document.all[id].innerHTML = text;
  }
  else (document.getElementById)
  {
     var div = document.getElementById(id);
     div.innerHTML = text;
  }
}


function bmi()  
{
  var bmiCalculator = document.getElementById('bmiCalculator');
  var wt = bmiCalculator.Subwt.value
  var ht = bmiCalculator.Subht.value

  if ((wt <= 0) || (ht <= 0)) 
  {
    alert("Some of the data you have entered is either a negative or zero value.  Please correct it and try again");
  }
  else 
  {
    var bodymassindex = wt/(ht*ht);
    var bodymassindexround= (Math.round(bodymassindex*100))/100;
/*
    sResult = new String("<p class='PageTitle'>Results<\/p><p class='BodyText'>Subject weight is <b>" + wt +"<\/b>&#160;kg<BR>Subject height is <b>" + ht +"<\/b>&#160;m<BR>Body Mass Index is <b>" + bodymassindexround +"<\/b>&#160;kg/m&sup2;<\/p>");
*/
    bmiCalculator.result.value = bodymassindexround;
  }
}


function bsa()  
{
  var bsaCalculator = document.getElementById('bsaCalculator');
  var wt = bsaCalculator.Subwt.value;
  ht = bsaCalculator.Subht.value;

  if ((wt <= 0) || (ht <= 0)) 
  {
    alert("Some of the data you have entered is either a negative or zero value.  Please correct it and try again");
  }
  else 
  {
    var bodySA = 0.007184*Math.pow(ht,0.725)*Math.pow(wt,0.425);
    var bodySAround= (Math.round(bodySA*100))/100;
/*
    var sResult = "<p class='PageTitle'>Results<\/p><p class='BodyText'>Subject weight is <b>" + wt +"<\/b>&#160;kg<BR>Subject height is <b>" + ht +"<\/b>&#160;m<BR>Body Surface Area is <b>" + bodySAround +"<\/b>&#160;m&sup2;<\/p><p class='BodyText'>The formula used in this calculation (the Dubois formula) is:<br><br>Body Surface area (m&sup2;) =<br> 0.007184 &times; (patient height in cm)<sup>0.725<\/sup> &times; (patient weight in kg)<sup>0.425<\/sup>" 
 */
    bsaCalculator.result.value = bodySAround;
  }
}

function creatCheck()  
{
  var creat = document.getElementById('creat');
  
  // ***check that units have been selected***
  
  var age = creat.patientAge.value;
  var weight = creat.patientWeight.value;

  if(age < 18) {
    layerWrite('results',"<table width='300'><tr><td>Cockcroft and Gault formula is not for use in patients under 18 years<\/td><\/tr><\/table>");
  }
  else {

  if(age > 70 || weight < 45 || weight > 90) {
    alert("This calculator has not been validated to calculate creatinine clearance for patients with an age greater than 70 years or with an ideal weight outside of the range 45 to 90kg");
  }

  creatCalculate();
  }
}

function creatCalculate()       
{
  var creat = document.getElementById('creat');
  var male = creat.elements[0].checked;
  var age = creat.patientAge.value;
  var weight = creat.patientWeight.value;
  var c = creat.creatconc.value;
  var clearance = null;
  var sFormula = null;

    clearance = (140-age) * weight / c;

    if (male == false)
    {
      clearance = clearance * 1.04;
      sFormula = new String("The formula used in this calculation was:<br>Estimated creatinine clearance in mL/minute = ((140 - " + age + ") &times; " + weight +" &times; 1.04) / (" + c + "))<\/p>");
    }
    else
    {
      clearance = clearance * 1.23;
      sFormula = new String("The formula used in this calculation was:<br>Estimated creatinine clearance in mL/minute = ((140 - " + age + ") &times; " + weight +" &times; 1.23) / (" + c + "))<\/p>");
    }

  if (sFormula == null)
    alert("There is an error in the script");
  else
  {
    clearance = (Math.round(clearance*100))/100;
    var sResult = new String("<p class='PageTitle'>Results<\/p><p class='BodyText'>The estimated creatinine clearance is:<br><b>" + clearance + " mL/min<\/b><BR><BR>");
  
    layerWrite('results',"<table width='300'><tr><td>" + sResult + sFormula + "<\/td><\/tr><\/table>");
  }
}

function instomms() 
{
  var lenconversions = document.getElementById('lenconversions');
  var result= lenconversions.ins.value;
  var lenconvresult=(result*25.4);
  lenconvresult=Math.round(lenconvresult*100)/100;
  lenconversions.tomms.value=lenconvresult;
}

function mmstoins() 
{
  var lenconversions = document.getElementById('lenconversions');
  var result=lenconversions.mms.value;
  var lenconvresult=(result/25.4);
  lenconvresult=Math.round(lenconvresult*100)/100;
  lenconversions.toins.value=lenconvresult;
}

function feettometres() 
{
  var lenconversions = document.getElementById('lenconversions');
  var result=lenconversions.feet.value;
  var lenconvresult=(result*0.3048);
  lenconvresult=Math.round(lenconvresult*100)/100;
  lenconversions.tometres.value=lenconvresult;
}

function metrestofeet() 
{
  var lenconversions = document.getElementById('lenconversions');
  var result=lenconversions.metres.value;
  var lenconvresult=(result/0.3048);
  lenconvresult=Math.round(lenconvresult*100)/100;
  lenconversions.tofeet.value=lenconvresult;
}

function yardstometres() 
{
  var lenconversions = document.getElementById('lenconversions');
  var result=lenconversions.yards.value;
  var lenconvresult=(result*0.9144);
  lenconvresult=Math.round(lenconvresult*100)/100;
  lenconversions.tometres2.value=lenconvresult;
}

function metrestoyards() 
{
  var lenconversions = document.getElementById('lenconversions');
  var result=lenconversions.metres2.value;
  var lenconvresult=(result/0.9144);
  lenconvresult=Math.round(lenconvresult*100)/100;
  lenconversions.toyards.value=lenconvresult;
}


function floztomls() 
{
  var volconversions = document.getElementById('volconversions');
  var result=volconversions.floz.value;
  var volconvresult=(result*28.409);
  volconvresult=Math.round(volconvresult*100)/100;
  volconversions.tomls.value=volconvresult;
}

function mlstofloz() 
{
  var volconversions = document.getElementById('volconversions');
  var result=volconversions.mls.value;
  var volconvresult=(result/28.409);
  volconvresult=Math.round(volconvresult*100)/100;
  volconversions.tofloz.value=volconvresult;
}

function pintstolitres() 
{
  var volconversions = document.getElementById('volconversions');
  var result=volconversions.pints.value;
  var volconvresult=(result*0.56825);
  volconvresult=Math.round(volconvresult*100)/100;
  volconversions.tolitres.value=volconvresult;
}

function litrestopints() 
{
  var volconversions = document.getElementById('volconversions');
  var result=volconversions.litres.value;
  var volconvresult=(result/0.56825);
  volconvresult=Math.round(volconvresult*100)/100;
  volconversions.topints.value=volconvresult;
}

function gallonstolitres() 
{
  var volconversions = document.getElementById('volconversions');
  var result=volconversions.gallons.value;
  var volconvresult=(result*4.5454);
  volconvresult=Math.round(volconvresult*100)/100;
  volconversions.tolitres2.value=volconvresult;
}

function litrestogallons() 
{
  var volconversions = document.getElementById('volconversions');
  var result=volconversions.litres2.value;
  var volconvresult=(result/4.5454);
  volconvresult=Math.round(volconvresult*100)/100;
  volconversions.togallons.value=volconvresult;
}

function lbstokgs() 
{
  var wtconversions = document.getElementById('wtconversions');
  var result=wtconversions.lbs.value;
  var wtconvresult=(result*0.45359);
  wtconvresult=Math.round(wtconvresult*100)/100;
  wtconversions.tokilos.value=wtconvresult;
}

function kgstolbs() 
{
  var wtconversions = document.getElementById('wtconversions');
  var result=wtconversions.kilos.value;
  var wtconvresult=(result/0.45359);
  wtconvresult=Math.round(wtconvresult*100)/100;
  wtconversions.tolbs.value=wtconvresult;
}

function stlbstokgs() 
{ 
  var wtconversions = document.getElementById('wtconversions');
  var result=wtconversions.stones.value;
  var result2=wtconversions.lbs2.value;
  if ((result2 >= 0) && (result2 <= 14)) 
  {
    var wtconvresult=((result*6.35029)+(result2*0.45359));
    wtconvresult=Math.round(wtconvresult*100)/100;
    wtconversions.tokilos2.value=wtconvresult;
  }
  else 
  {
    alert("The value for the number of pounds must be between 0 and 14");
    wtconversions.lbs2.value="";
    result2=0;
    var wtconvresult=((result*6.35029)+(result2*0.45359));
    wtconvresult=Math.round(wtconvresult*100)/100;
    wtconversions.tokilos2.value=wtconvresult;     
  }
}

function paraCalculate()  
{
  var paracet = document.getElementById('paracet');
  var hr = paracet.Yes.checked;
  var lr = paracet.No.checked;
  var t = paracet.dosetime.value;
  var c = paracet.paraconc.value;
 
  if (((hr ==false) && (lr == false)) || ((hr ==true) && (lr == true))) 
  {
        alert("Please check one of either the high-risk or low-risk checkboxes.");
  }
  else if (t < 4 || t > 24)
  {
        alert("Please enter a time in hours between 4 and 24.");
  }
  else 
  {
    if (hr == false)  
    {
      var safe = 200/Math.pow(2,((t/4)-1));
      var saferound = Math.round(safe*100)/100;
    }
    else  
    {
      var safe = 100/Math.pow(2, ((t/4)-1));
      var saferound = Math.round(safe*100)/100;
    }

    if (c > safe)
      txt = "above";
    else if (c < safe)
      txt = "below";
    else
      txt = "on";

    var result = "The treatment line reading is: " + saferound + " mg/litre.";
    var treatment = "The patient's plasma-paracetamol concentration is " + txt + " the treatment line.";
    
    layerWrite('result', result);
    layerWrite('treatment', treatment);
    alert(result + "\n" + treatment);
  }
}

function pregnancy()    
{
  var preg = document.getElementById('preg');
  var md = preg.mensDay.value;
  var mmind = preg.mensMonth.selectedIndex;
  var mm = preg.mensMonth.options[mmind].value;
  var myind =  preg.mensYear.selectedIndex;
  var my = preg.mensYear.options[myind].value;

  var mensDate = new Date();
  mensDate.setYear(my);
  mensDate.setMonth(mm);
  mensDate.setDate(md);

  var mensValue = mensDate.getTime();
  var dueValue = mensValue + 24192000000;
  var dueDate = new Date();
  dueDate.setTime(dueValue);

  var days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
  var months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
  var datedue = days[dueDate.getDay()] + " " + dueDate.getUTCDate() + " " + months[dueDate.getMonth()] + " " + dueDate.getFullYear();

/*
  layerWrite('results','rightPage',"<p class='PageTitle'>Results<\/p><p class='BodyText'>Due date: " + datedue + "<\/p>");
*/
  var md = preg.result.value = datedue;
}
