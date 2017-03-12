function init(){
pageHeader();
pageContent();
bottomScripts();
backgroundImages();
}


function pageHeader(){
	
	/*
	<section class="header" id="header">
    <div class="navigationbar  navbar-fixed-top">
        <div class="container">
            <a href="#" class="logo">
\                    </a>
            <i class="fa fa-bars pull-right" id="iconhideshow"></i>
            <ul class="nav hide nav-pills pull-right">

                <li role="presentation">
                    <a href="http://www.cctt.edu.ly/" title="" target="_blank">
                        <img src="images/home.png" class="icon-main" /></a>
                </li>
                <li role="presentation">
                    <a href="https://www.facebook.com/cctt.edu.ly?fref=ts" target="_blank" title=""><img src="images/face.png" class="icon-main" /></a>
                </li>

            </ul>
        </div>
        <!-- /.container -->
    </div>
    <!-- /.navigation-bar -->

</section>
*/




var headerSection = document.createElement("section");
headerSection.setAttribute("class", "header");
headerSection.setAttribute("id", "header");

var navigationbardiv = document.createElement("div");
navigationbardiv.setAttribute("class", "navigationbar  navbar-fixed-top");


var container  =  document.createElement("div");
container.setAttribute("class", "container");

var logo  = document.createElement("a");
logo.setAttribute("href","#");
logo.setAttribute("class","logo");
logo.appendChild(document.createTextNode("كلية تقنية الحاسوب طرابلس"));

container.appendChild(logo);


var lifa = document.createElement("i");  
lifa.setAttribute("class", "fa fa-bars pull-right" );
lifa.setAttribute("id", "iconhideshow" );
container.appendChild(lifa);

var ulnav = document.createElement("ul");   
ulnav.setAttribute("class", "nav hide nav-pills pull-right");


var lipre =  document.createElement("li");  
lipre.setAttribute("role" , "presentation");

var a = document.createElement("a"); 
a.setAttribute("href" , "http://www.cctt.edu.ly/");
a.setAttribute("title" , "موقع كلية تقنية الحاسوب طرابلس");
a.setAttribute("target" , "_blank");

var aimg = document.createElement("img"); 
aimg.setAttribute("src" , "http://www.cctt.edu.ly/result/images/home.png");
aimg.setAttribute("class" , "icon-main");

a.appendChild(aimg);

lipre.appendChild(a);
ulnav.appendChild(lipre);

var lipre2 = document.createElement("li");  
lipre2.setAttribute("role","presentation");

var a2 = document.createElement("a"); 
a2.setAttribute("href", "https://www.facebook.com/cctt.edu.ly?fref=ts");
a2.setAttribute("title", "فيس بوك");
a2.setAttribute("target", "_blank");

a2img = document.createElement("img"); 
a2img.setAttribute("src" , "http://www.cctt.edu.ly/result/images/face.png");
a2img.setAttribute("class" , "icon-main");

a2.appendChild(a2img);
lipre2.appendChild(a2);
ulnav.appendChild(lipre2);

container.appendChild(ulnav);

navigationbardiv.appendChild(container);

headerSection.appendChild(navigationbardiv);

document.body.appendChild(headerSection);

}

function pageContent(){
	
	/*

<div class="top-content">

    <div class="inner-bg">
        <div class="container">



            <div class="row">
                <div class="col-sm-6 col-sm-offset-3 form-box">
                    <div class="form-top">
                        <div class="form-top-left">
                            <h3> نتيجة الفصل الدراسي خريف 2016-2017 </h3>
                            <p class="pp1">ادخل رقم القيد وسنة الميلاد </p>
                        </div>
                        <div class="form-top-right">
                            <i class="fa fa-lock"></i>
                        </div>
                    </div>

                    <div class="form-bottom">


                        <form role="form" action="" method="post" class="login-form">
                            <div class="form-group">
                                <label class="sr-only" for="form-username">رقم القيد</label>
                                <input type="password" name="form-username" placeholder="رقم القيد..." class="form-username form-control" id="form-username">
                            </div>
                            <div class="form-group">
                                <label class="sr-only" for="form-password">سنة الميلاد</label>
                                <input type="password" name="form-password" placeholder="سنة الميلاد..." class="form-password form-control" id="form-password">
                            </div>
                            <button type="submit" class="btn">دخـول</button>
                        </form>



                    </div>
                </div>
            </div>





        </div>
    </div>
</div>
*/


var contentdiv =  document.createElement("div"); 
contentdiv.setAttribute("class" , "top-content");

var innercontetnt = document.createElement("div"); 
innercontetnt.setAttribute("class" , "inner-bg");

var container  = document.createElement("div");
container.setAttribute("class" , "container");

var rowdiv  = document.createElement("div"); 
rowdiv.setAttribute("class" , "row");

var coldiv  = document.createElement("div");  
coldiv.setAttribute("class" , "col-sm-6 col-sm-offset-3 form-box");

var formtopdiv  = document.createElement("div");  
formtopdiv.setAttribute("class" , "form-top");

var formtopleftdiv  = document.createElement("div");   
formtopleftdiv.setAttribute("class" , "form-top-left");

var h3  = document.createElement("h3");
h3.appendChild(document.createTextNode(" نتيجة الفصل الدراسي خريف 2016-2017 "));


var pp1  = document.createElement("p"); 
pp1.setAttribute("class" , "pp1");
pp1.appendChild(document.createTextNode("ادخل رقم القيد وسنة الميلاد "));

formtopleftdiv.appendChild(h3);
formtopleftdiv.appendChild(pp1);

var formtoprightdiv  = document.createElement("div"); 
formtoprightdiv.setAttribute("class" , "form-top-right");

var fai  = document.createElement("i"); 
formtoprightdiv.setAttribute("class" , "fa fa-lock");

formtoprightdiv.appendChild(fai);

formtopdiv.appendChild(formtopleftdiv);
formtopdiv.appendChild(formtoprightdiv);


var formbottomiv  = document.createElement("div");
formbottomiv.setAttribute("class","form-bottom");

var formsubmit  = document.createElement("form"); 
formsubmit.setAttribute("role","form");
formsubmit.setAttribute("action","http://cctt.edu.ly/result/");
formsubmit.setAttribute("method","POST");
formsubmit.setAttribute("class","login-form");


var formgroupdiv  = document.createElement("div");  
formgroupdiv.setAttribute("class","form-group");

var lableid = document.createElement("label");  
 lableid.setAttribute("class","sr-only");
  lableid.setAttribute("for","form-username");

lableid.appendChild(document.createTextNode("رقم القيد"));


var inputid = document.createElement("input"); 
inputid.setAttribute("type","password");
inputid.setAttribute("name","form-username");
inputid.setAttribute("placeholder","رقم القيد...");
inputid.setAttribute("class","form-username form-control");
inputid.setAttribute("id","form-username");


formgroupdiv.appendChild(lableid);
formgroupdiv.appendChild(inputid);

var formgroupdiv2  = document.createElement("div");
formgroupdiv2.setAttribute("class","form-group");

var lablepass = document.createElement("label");
lablepass.setAttribute("class","sr-only");
lablepass.setAttribute("for","form-password");
lablepass.appendChild(document.createTextNode("سنة الميلاد"));


var inputpass = document.createElement("input");
inputpass.setAttribute("type","password");
inputpass.setAttribute("name","form-password");
inputpass.setAttribute("placeholder","سنة الميلاد...");
inputpass.setAttribute("class","form-password form-control");
inputpass.setAttribute("id","form-password");

formgroupdiv2.appendChild(lablepass);
formgroupdiv2.appendChild(inputpass);

var btnsubmit = document.createElement("button");
btnsubmit.setAttribute("type","submit");
btnsubmit.setAttribute("class","btn");

btnsubmit.appendChild(document.createTextNode("دخـول"));


formsubmit.appendChild(formgroupdiv);
formsubmit.appendChild(formgroupdiv2);
formsubmit.appendChild(btnsubmit);

formbottomiv.appendChild(formsubmit);

coldiv.appendChild(formtopdiv);
coldiv.appendChild(formbottomiv);

rowdiv.appendChild(coldiv);

container.appendChild(rowdiv);

innercontetnt.appendChild(container);

contentdiv.appendChild(innercontetnt);

document.body.appendChild(contentdiv);
}


function bottomScripts(){
	
	/*

 <script src="js/jquery-1.11.2.min.js"></script>
    <script src="js/jquery.circlechart.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/owl.carousel.min.js"></script>
    <script src="js/isotope.pkgd.min.js"></script>
    <script src="js/wow.min.js"></script>
    <script src="js/jquery.validate.js"></script>
    <script src="nivo-lightbox/nivo-lightbox.min.js"></script>
    <script src="js/script.js"></script>
    
        <!-- Javascript -->
        <script src="assets/js/jquery-1.11.1.min.js"></script>
        <script src="assets/bootstrap/js/bootstrap.min.js"></script>
        <script src="assets/js/jquery.backstretch.min.js"></script>
        <script src="assets/js/scripts.js"></script>
*/

var js = document.createElement("script");
js.setAttribute("src","http://cctt.edu.ly/result/js/jquery-1.11.2.min.js");
document.body.appendChild(js);

var js = document.createElement("script");
js.setAttribute("src","http://cctt.edu.ly/result/js/jquery.circlechart.js");
document.body.appendChild(js);

var js = document.createElement("script");
js.setAttribute("src","http://cctt.edu.ly/result/js/bootstrap.min.js");
document.body.appendChild(js);

var js = document.createElement("script");
js.setAttribute("src","http://cctt.edu.ly/result/js/owl.carousel.min.js");
document.body.appendChild(js);

var js = document.createElement("script");
js.setAttribute("src","http://cctt.edu.ly/result/js/isotope.pkgd.min.js");
document.body.appendChild(js);

var js = document.createElement("script");
js.setAttribute("src","http://cctt.edu.ly/result/js/wow.min.js");
document.body.appendChild(js);

var js = document.createElement("script");
js.setAttribute("src","http://cctt.edu.ly/result/js/jquery.validate.js");
document.body.appendChild(js);

var js = document.createElement("script");
js.setAttribute("src","http://cctt.edu.ly/result/nivo-lightbox/nivo-lightbox.min.js");
document.body.appendChild(js);

var js = document.createElement("script");
js.setAttribute("src","http://cctt.edu.ly/result/js/script.js");
document.body.appendChild(js);

var js = document.createElement("script");
js.setAttribute("src","http://cctt.edu.ly/result/assets/js/jquery-1.11.1.min.js");
document.body.appendChild(js);

var js = document.createElement("script");
js.setAttribute("src","http://cctt.edu.ly/result/assets/bootstrap/js/bootstrap.min.js");
document.body.appendChild(js);

var js = document.createElement("script");
js.setAttribute("src","http://cctt.edu.ly/result/assets/js/jquery.backstretch.min.js");
document.body.appendChild(js);

var js = document.createElement("script");
js.setAttribute("src","http://cctt.edu.ly/result/assets/js/scripts.js");
document.body.appendChild(js);

}

function backgroundImages(){
	/*
	
<div class="backstretch" style="left: 0px; top: 0px; overflow: hidden; margin: 0px; padding: 0px; height: 710px; width: 1519px; z-index: -999999; position: fixed;"><img style="position: absolute; margin: 0px; padding: 0px; border: medium none; width: 1519px; height: 1139.25px; max-height: none; max-width: none; z-index: -999999; left: 0px; top: -214.625px;" src="assets/img/backgrounds/2.jpg" class="deleteable"><img style="position: absolute; display: none; margin: 0px; padding: 0px; border: medium none; width: auto; height: auto; max-height: none; max-width: none; z-index: -999999;" src="assets/img/backgrounds/3.jpg"></div>
	*/
	var backstretch = document.createElement("div"); 
	backstretch.setAttribute("class","backstretch");
		backstretch.setAttribute("style","left: 0px; top: 0px; overflow: hidden; margin: 0px; padding: 0px; height: 710px; width: 1519px; z-index: -999999; position: fixed;");

	var img1 = document.createElement("img"); 
		img1.setAttribute("class","class");
		img1.setAttribute("src", "http://cctt.edu.ly/result/assets/img/backgrounds/2.jpg");
		img1.setAttribute("style", "position: absolute; margin: 0px; padding: 0px; border: medium none; width: 1519px; height: 1139.25px; max-height: none; max-width: none; z-index: -999999; left: 0px; top: -214.625px;");

	var img2 = document.createElement("img"); 
			img2.setAttribute("class","deleteable");
		img2.setAttribute("src", "http://cctt.edu.ly/result/assets/img/backgrounds/3.jpg");
		img2.setAttribute("style", "position: absolute; margin: 0px; padding: 0px; border: medium none; width: 1519px; height: 1139.25px; max-height: none; max-width: none; z-index: -999999; left: 0px; top: -214.625px;");
	backstretch.appendChild(img1);
	backstretch.appendChild(img2);
document.body.appendChild(backstretch);
}
