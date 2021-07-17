///////////////////////////////////////////////////////////////////////////////////////////////
// BEGIN EDITS ////////////////////////////////////////////////////////////////////////////////

const TEMPLATE_FILE_ID = '15_i7kNDX-04eRaBD8jAxZ0ULmbiEcGLAhSI2z34IDao';
const TEMP_FOLDER_ID = '1X4d7HB3bKBoOqDi3mkwUQgQ7ruLsgdBF';
const PDF_FOLDER_ID = '1X4d7HB3bKBoOqDi3mkwUQgQ7ruLsgdBF';

// END EDITS //////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
// WARNING: EDITING ANYTHING BELOW THIS LINE WILL CHANGE THE BEHAVIOR OF THE SCRIPT. //////////
// DO SO AT YOUR OWN RISK.//// ////////////////////////////////////////////////////////////////
// ----------------------------------------------------------------------------------------- //


function toVenue(val) {
    var op=val;
    if(val=="Google Meet"){
      op="Video Conferencing over Google Meet"
    }
    else if(val=="NLI FabLab"){
      op="NLI FabLab, \n\t Room No. 806, K. J. Somaiya Institute of Engineering and Information Technology"
    }
    return `${op}`;
}
function toMember(val){
  var op="1. ";
  no=2; 
  for(i=0;i<val.length;i++){
    if(val[i]==','){
      op=op+"\n";
      op+=no;
      op+=". "
      no++;
      i++;
    }else{
      op=op+val[i];
    }    
  }
  return `${op}`;
}

function points(val){
  var op="1. ";
  no=2; 
  for(i=0;i<val.length;i++){
    op=op+val[i];
    if(val[i]=="\n"){
      op+=no;
      op+=". "
      no++;
    }
  }
  return `${op}`;
}

function toApprove(val){
  var op="Jatin Bhosale";
  if(val=="Jatin Bhosale"){
    op="Dr. Umesh Shinde";
  }
  return `${op}`;
}


// Format datetimes to: MMMM D, YYYY
function toDateFmt(dt_string) {
  var millis = Date.parse(dt_string);
  var date = new Date(millis);
  var year = date.getFullYear();
  var month = "";
  var mt = date.getMonth();
   if  (mt === 0) {
   month = "January";
  }if (mt === 1) {
   month = "February";
  }if (mt === 2) {
   month = "March";
  }if (mt === 3) {
   month = "April";
  }if (mt === 4) {
   month = "May";
  }if (mt === 5) {
   month = "June";   
  }if (mt === 6) { 
   month = "July"; 
  }if (mt === 7) {
   month = "August";  
  }if (mt === 8) {
   month = "September";  
  }if (mt === 9) {
   month = "October";  
  }if (mt === 10){
  month = "November";
  }else if (mt === 11){
  month = "December";
  }
  var day = ("0" + date.getDate()).slice(-2);

  // Return the date in MMMM D, YYYY format
  return `${month} ${day}, ${year}`;
}
// Format times to: HH:MM AM/PM
function toTimeFmt(dt_string) {
  var millis = Date.parse(dt_string);
  var date = new Date(millis);
  var hour = ("0" + (date.getHours() + 1)).slice(-2);
  var minute = ("0" + (date.getMinutes() + 1)).slice(-2);
  var m = "AM";
  if(hour>12){
      m="PM";
      hour=hour-12;
  }

  // Return the date in HH:MM AM/PM format
  return `${hour}:${minute} ${m}`;
}


// Parse and extract the data submitted through the form.
function parseFormData(values, header) {
    // Set temporary variables to hold prices and data.
    var response_data = {};

    var approve="Jatin Bhosale";
    var adjourn="The meeting was adjourned by ";
    var a_by = "";
    var tm1 = "";
    var dt1 = "";
    var tm2 = "";

    // Iterate through all of our response data and add the keys (headers)
    // and values (data) to the response dictionary object.
    for (var i = 0; i < values.length; i++) {
      // Extract the key and value
      var key = header[i];
      var value = values[i];

      // If we have a price, add it to the running subtotal and format it to the
      // desired currency.
      if (key.toLowerCase().includes("date")) {
        if (key.toLowerCase().includes("next meeting date")) {
          if(value!=""){
            dt1 = toDateFmt(value);
          }
        } else{
            value = toDateFmt(value);
        }          
        
      } else if (key.toLowerCase().includes("time")) {
        if (key.toLowerCase().includes("end time")) {
            tm1 = toTimeFmt(value);
        } else if (key.toLowerCase().includes("next meeting time")) {
          if(value!=""){
            tm2 = toTimeFmt(value);
          }
        } else{
            value = toTimeFmt(value);
        }          
      } else if (key.toLowerCase().includes("venue")) {
        value = toVenue(value);
      } else if (key.toLowerCase().includes("members")) {
        value = toMember(value);
      } else if (key.toLowerCase().includes("agenda")) {
        value = points(value);
      } else if (key.toLowerCase().includes("business")) {
        value = points(value);
      } else if (key.toLowerCase().includes("resolution")) {
        value = points(value);
      } else if (key.toLowerCase().includes("adjournment")) {
        value = toAdj(value);
      } else if (key.toLowerCase().includes("minutes")) {
        approve = toApprove(value);
      } else if (key.toLowerCase().includes("adjourned by")) {
        a_by = value;
      } 

      // Add the key/value data pair to the response dictionary.
      response_data[key] = value;
    }

    adjourn = adjourn + a_by + " at " + tm1;
    if(dt1!=""){
      adjourn = adjourn + ". The next meeting is scheduled on " + dt1;
      if(tm2 != ""){
        adjourn = adjourn + " at " + tm2;
      }
    }
    adjourn+=".";
    response_data["Approved"]=approve;
    response_data["Adjournment"]=adjourn;
    
    return response_data;
}

// Helper function to inject data into the template
function populateTemplate(document, response_data) {

    // Get the document header and body (which contains the text we'll be replacing).
    var document_header = document.getHeader();
    var document_body = document.getBody();

    // Replace variables in the header
    for (var key in response_data) {
      var match_text = `{{${key}}}`;
      var value = response_data[key];
      // Replace our template with the final values
      document_header.replaceText(match_text, value);
      document_body.replaceText(match_text, value);
    }

}

function email(name, email, minutes_by, filename, pdfFile){
  var html = "Dear " + name + ",<br><br> Please find attachment for <b>" + filename + "</b> generated by " + minutes_by + " using the Auto-MOM generator prepared by Jatin Bhosale using Google Scripts. <br><br> Regards,<br>Jatin Bhosale.<br><br><br><br> <b>CONFIDENTIAL</b>: This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error please notify the system manager. This message contains confidential information and is intended only for the individual named. If you are not the named addressee you should not disseminate, distribute or copy this e-mail. Please notify the sender immediately by e-mail if you have received this e-mail by mistake and delete this e-mail from your system. If you are not the intended recipient you are notified that disclosing, copying, distributing or taking any action in reliance on the contents of this information is strictly prohibited.";
  var mail_msg = html.replace(/\<br\/\>/gi, '\n').replace(/(<([^>]+)>)/ig, ""); // clear html tags and convert br to new lines for plain mail

  GmailApp.sendEmail(email,filename, mail_msg, {
    htmlBody: html,
    attachments: [pdfFile],
    name: filename
  });
}

// Function to populate the template form
function createDocFromForm() {

  // Get active sheet and tab of our response data spreadsheet.
  var sheet = SpreadsheetApp.getActiveSheet();
  var last_row = sheet.getLastRow() - 1;

  // Get the data from the spreadsheet.
  var range = sheet.getDataRange();
 
  // Identify the most recent entry and save the data in a variable.
  var data = range.getValues()[last_row];
  
  // Extract the headers of the response data to automate string replacement in our template.
  var headers = range.getValues()[0];

  // Parse the form data.
  var response_data = parseFormData(data, headers);
  
  // Retreive the template file and destination folder.
  var template_file = DriveApp.getFileById(TEMPLATE_FILE_ID);
  var temp_folder = DriveApp.getFolderById(TEMP_FOLDER_ID);
  var pdf_folder = DriveApp.getFolderById(PDF_FOLDER_ID);

  // Copy the template file so we can populate it with our data.
  // The name of the file will be the company name and the invoice number in the format: DATE_COMPANY_NUMBER
  var filename = `${"Minutes of Meeting dated "}${response_data["Date"]}`;
  var document_copy = template_file.makeCopy(filename, temp_folder);

  // Open the copy.
  var document = DocumentApp.openById(document_copy.getId());

  // Populate the template with our form responses and save the file.
  populateTemplate(document, response_data);
  document.saveAndClose();

  const blobPDF = document_copy.getAs(MimeType.PDF);
  const pdfFile = pdf_folder.createFile(blobPDF).setName(filename);
  temp_folder.removeFile(document_copy);

  sheet.getRange(last_row+1,16).setValue(pdfFile.getUrl());


  var mail_list = new Array(100);
  list(mail_list);


  email("Jatin Bhosale","jatin.bhosale@somaiya.edu",response_data["Minutes of Meeting prepared by"], filename, pdfFile);
  if(response_data["Email address"]!="jatin.bhosale@somaiya.edu"){
    email(response_data["Minutes of Meeting prepared by"],response_data["Email address"],response_data["Minutes of Meeting prepared by"], filename, pdfFile);
  }
  key = response_data["Members"];
  for(i=0;i<mail_list.length;i+=2){
    if(response_data["Email address"]!=mail_list[i+1]){
      if(key.includes(mail_list[i])){
        email(mail_list[i],mail_list[i+1],response_data["Minutes of Meeting prepared by"], filename, pdfFile);
      }
    }
  }

}


function list(mail_list){
  i = 0;
  mail_list[i] = "Pavan Jangam",  mail_list[i+1] = "pavan.jangam@somaiya.edu", i+=2;
  mail_list[i] = "Rinkesh Sante",  mail_list[i+1] = "rinkesh.sante@somaiya.edu", i+=2;
  mail_list[i] = "Vidit Shah",  mail_list[i+1] = "vidit.shah@somaiya.edu", i+=2;
  mail_list[i] = "Pratik Gangapurwala",  mail_list[i+1] = "p.gangapurwala@somaiya.edu", i+=2;
}








