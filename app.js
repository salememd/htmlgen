function init(){
var body = [pageHeader() , pageContent()];
 body = arrayMerge(body , bottomScripts());
 body.push(backgroundImages());

render(body);

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


var headerSection = HTMLGen("section" ,  {"class": "header" , "id": "header" }, true);

var navigationbardiv = HTMLGen("div" ,  {"class": "navigationbar  navbar-fixed-top" }, true);

var container  = HTMLGen("div" ,  {"class": "container" }, true);

var logo  = HTMLGen("a" ,  {"href": "#","class": "logo" }, true);
logo.addValue("كلية تقنية الحاسوب طرابلس");
container.addValue(logo);

var lifa = HTMLGen("i" ,  {"class": "fa fa-bars pull-right" , "id": "iconhideshow" }, true);
container.addValue(lifa);

var ulnav = HTMLGen("ul" ,  {"class": "nav hide nav-pills pull-right"}, true);

var lipre = HTMLGen("li" ,  {"role": "presentation"}, true);
var a = HTMLGen("a" ,  {"href": "http://www.cctt.edu.ly/" , title: "موقع كلية تقنية الحاسوب طرابلس" , target: "_blank" }, true);
a.addValue(HTMLGen("img" ,  {"src": "http://www.cctt.edu.ly/result/images/home.png" , "class": "icon-main"}));
lipre.addValue(a);
ulnav.addValue(lipre);

var lipre2 = HTMLGen("li" ,  {"role": "presentation"}, true);
var a2 = HTMLGen("a" ,  {"href": "https://www.facebook.com/cctt.edu.ly?fref=ts" , title: "فيس بوك" , target: "_blank" }, true);
a2.addValue(HTMLGen("img" ,  {"src": "http://www.cctt.edu.ly/result/images/face.png" , "class": "icon-main"}));
lipre2.addValue(a2);
ulnav.addValue(lipre2);

container.addValue(ulnav);

navigationbardiv.addValue(container);

headerSection.addValue(navigationbardiv);


return headerSection;
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


var contentdiv = HTMLGen("div" ,  {"class": "top-content"}, true);

var innercontetnt = HTMLGen("div" ,  {"class": "inner-bg" }, true);

var container  = HTMLGen("div" ,  {"class": "container" }, true);

var rowdiv  = HTMLGen("div" ,  {"class": "row" }, true);

var coldiv  = HTMLGen("div" ,  {"class": "col-sm-6 col-sm-offset-3 form-box" }, true);

var formtopdiv  = HTMLGen("div" ,  {"class": "form-top" }, true);

var formtopleftdiv  = HTMLGen("div" ,  {"class": "form-top-left" }, true);

var h3  = HTMLGen("h3" ,  {} , true);
h3.addValue(" نتيجة الفصل الدراسي خريف 2016-2017 ");


var pp1  = HTMLGen("p" ,  {"class": "pp1" } , true);
pp1.addValue("ادخل رقم القيد وسنة الميلاد ");

formtopleftdiv.addValue(h3);
formtopleftdiv.addValue(pp1);

var formtoprightdiv  = HTMLGen("div" ,  {"class": "form-top-right" }, true);
formtoprightdiv.addValue(HTMLGen("i" ,  {"class": "fa fa-lock" }, true));

formtopdiv.addValue(formtopleftdiv);
formtopdiv.addValue(formtoprightdiv);


var formbottomiv  = HTMLGen("div" ,  {"class": "form-bottom" }, true);
var formsubmit  = HTMLGen("form" ,  {"role": "form", "action": "http://cctt.edu.ly/result/" , "method": "POST", "class": "login-form" }, true);

var formgroupdiv  = HTMLGen("div" ,  {"class": "form-group" }, true);
var lableid = HTMLGen("label" ,  {"class": "sr-only", "for": "form-username"}, true);
lableid.addValue("رقم القيد");

var inputid = HTMLGen("input" ,  {"type": "password", "name": "form-username" , "placeholder": "رقم القيد..." , "class": "form-username form-control" , "id": "form-username"});

formgroupdiv.addValue(lableid);
formgroupdiv.addValue(inputid);

var formgroupdiv2  = HTMLGen("div" ,  {"class": "form-group" }, true);

var lablepass = HTMLGen("label" ,  {"class": "sr-only", "for": "form-password"}, true);
lablepass.addValue("سنة الميلاد");

var inputpass = HTMLGen("input" ,  {"type": "password", "name": "form-password" , "placeholder": "سنة الميلاد..." , "class": "form-password form-control" , "id": "form-password"});

formgroupdiv2.addValue(lablepass);
formgroupdiv2.addValue(inputpass);

var btnsubmit = HTMLGen("button" ,  {"type": "submit", "class": "btn"} , true);
btnsubmit.addValue("دخـول");


formsubmit.addValue(formgroupdiv);
formsubmit.addValue(formgroupdiv2);
formsubmit.addValue(btnsubmit);

formbottomiv.addValue(formsubmit);

coldiv.addValue(formtopdiv);
coldiv.addValue(formbottomiv);

rowdiv.addValue(coldiv);

container.addValue(rowdiv);

innercontetnt.addValue(container);

contentdiv.addValue(innercontetnt);

return contentdiv;
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


var ja = [HTMLGen("script" ,  {"src": "http://cctt.edu.ly/result/js/jquery-1.11.2.min.js"}, true), HTMLGen("script" ,  {"src": "http://cctt.edu.ly/result/js/jquery.circlechart.js"}, true), HTMLGen("script" ,  {"src": "http://cctt.edu.ly/result/js/bootstrap.min.js"}, true), HTMLGen("script" ,  {"src": "http://cctt.edu.ly/result/js/owl.carousel.min.js"}, true), HTMLGen("script" ,  {"src": "http://cctt.edu.ly/result/js/isotope.pkgd.min.js"}, true), HTMLGen("script" ,  {"src": "http://cctt.edu.ly/result/js/wow.min.js"}, true) , HTMLGen("script" ,  {"src": "http://cctt.edu.ly/result/js/jquery.validate.js"}, true), HTMLGen("script" ,  {"src": "http://cctt.edu.ly/result/nivo-lightbox/nivo-lightbox.min.js"}, true) , HTMLGen("script" ,  {"src": "http://cctt.edu.ly/result/js/script.js"}, true), HTMLGen("script" ,  {"src": "http://cctt.edu.ly/result/assets/js/jquery-1.11.1.min.js"}, true),HTMLGen("script" ,  {"src": "http://cctt.edu.ly/result/assets/bootstrap/js/bootstrap.min.js"}, true),HTMLGen("script" ,  {"src": "http://cctt.edu.ly/result/assets/js/jquery.backstretch.min.js"}, true),HTMLGen("script" ,  {"src": "http://cctt.edu.ly/result/assets/js/scripts.js"}, true)];

return ja;
}

function backgroundImages(){
	/*
	
<div class="backstretch" style="left: 0px; top: 0px; overflow: hidden; margin: 0px; padding: 0px; height: 710px; width: 1519px; z-index: -999999; position: fixed;"><img style="position: absolute; margin: 0px; padding: 0px; border: medium none; width: 1519px; height: 1139.25px; max-height: none; max-width: none; z-index: -999999; left: 0px; top: -214.625px;" src="assets/img/backgrounds/2.jpg" class="deleteable"><img style="position: absolute; display: none; margin: 0px; padding: 0px; border: medium none; width: auto; height: auto; max-height: none; max-width: none; z-index: -999999;" src="assets/img/backgrounds/3.jpg"></div>
	*/
	var backstretch = HTMLGen("div" ,  {"class": "backstretch" , "style": "left: 0px; top: 0px; overflow: hidden; margin: 0px; padding: 0px; height: 710px; width: 1519px; z-index: -999999; position: fixed;"}, true);
	var img1 = HTMLGen("img" ,  {"class": "deleteable" , "src": "http://cctt.edu.ly/result/assets/img/backgrounds/2.jpg" , "style": "position: absolute; margin: 0px; padding: 0px; border: medium none; width: 1519px; height: 1139.25px; max-height: none; max-width: none; z-index: -999999; left: 0px; top: -214.625px;"});
	var img2 = HTMLGen("img" ,  {"class": "deleteable" , "src": "http://cctt.edu.ly/result/assets/img/backgrounds/3.jpg" , "style": "position: absolute; margin: 0px; padding: 0px; border: medium none; width: 1519px; height: 1139.25px; max-height: none; max-width: none; z-index: -999999; left: 0px; top: -214.625px;"});
	backstretch.addValue(img1);
	backstretch.addValue(img2);
	
	return backstretch;
}

function arrayMerge(base, addendum) {
    var out = [].concat(base);
    for (var i = 0, len = addendum.length; i < len; i++) {
        if (base.indexOf(addendum[i]) < 0) {
            out.push(addendum[i]);
        }
    }
    return out;
