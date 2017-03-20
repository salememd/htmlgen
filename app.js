function init(){
var rootLayout = new JSLayout();
rootLayout.setClassName("rootlayout");

var inusername = new JSLayout();
inusername.setClassName("inusername");

var tv = new JSTextView();
tv.setText("Username: ");

var username = new JSEditText();
username.setHint("Enter your username");

inusername.add(tv);
inusername.add(username);

var inpass = new JSLayout();
inpass.setClassName("inpass");

var ps = new JSTextView();
ps.setText("Password: ");

var password = new JSEditText();
password.setHint("Enter your Password");

inpass.add(ps);
inpass.add(password);

rootLayout.add(inusername);
rootLayout.add(inpass);


var button = new JSButton();
button.setTitle("Login");
button.setWidth("155px");

button.addOnClickListener(function(){
 var msg = new JSPopUpMessages();
 msg.setMessage("Welcome !");
 var btn = new JSButton();
 btn.setTitle("Close");
 btn.addOnClickListener(function(){
 msg.hide();
 });
 
 msg.addButton(btn);
 msg.show(); 
 
 });
 
rootLayout.add(button);

rootLayout.render();
}