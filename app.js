function init(){
var rootLayout = new JSLayout({"class": "rootlayout"});

var inusername = new JSLayout({"class": "inusername"});

var tv = new JSTextView();
tv.setText("Username: ");

var username = new JSEditText({"placeholder": "Enter your username"});

inusername.add(tv);
inusername.add(username);

var inpass = new JSLayout({"class": "inpass"});

var ps = new JSTextView();
ps.setText("Password: ");

var password = new JSEditText({"placeholder": "Enter your Password"});

inpass.add(ps);
inpass.add(password);

rootLayout.add(inusername);
rootLayout.add(inpass);


var button = new JSButton({"class": "loginbutton","value": "Login" , "style": "width: 155px;height:22px" , "type": "submit"});

button.addOnClickListener(function(){
	
 var msg = new JSPopUpMessages();
 msg.setMessage("Welcome !");
 var btn = new JSButton({"value": "Close","type": "submit"});
 btn.addOnClickListener(function(){
 msg.hide();
 });
 
 msg.addButton(btn);
 msg.show(); 
 
 });
 
rootLayout.add(button);

rootLayout.render();
}