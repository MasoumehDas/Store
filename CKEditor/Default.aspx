<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" Debug="true" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>ثبت اطلاعات</title>
    <script src="ckeditor/ckeditor.js" type="text/javascript"></script>
    <script src="ckeditor/adapters/jquery.js" type="text/javascript"></script>
    <link href="ckeditor/contents.css" rel="stylesheet" type="text/css" />
    <script src="ckfinder/ckfinder.js" type="text/javascript"></script>
    <script src="script/bootstrap/js/jquery-3-5-0.js" type="text/javascript"></script>
    <link href="script/bootstrap/css/bootstrap-fa.css" rel="stylesheet" type="text/css" />

    <script type="text/javascript">
        //var URL = "http://localhost:11938/api/";

        function openCKFinder() {
            var finder = new CKFinder();
            finder.basePath = '../ckfinder/';
            finder.selectActionFunction = SetFileField;
            finder.selectActionFunction = SetFileField;
            finder.popup();
        }
        function SetFileField(fileUrl) {
            document.getElementById('imgurl').value = fileUrl;
            imgsrc.innerHTML = '<img width="50" height="50" src="' + fileUrl + '" />';
        }
        //var finder = new CKFinder();
        //finder.selectActionData = "container";
        //finder.selectActionFunction = function (fileUrl, data) {
        //    alert('Selected file: ' + fileUrl);
        //    // Using CKFinderAPI to show simple dialog.
        //    this.openMsgDialog('', 'Additional data: ' + data['selectActionData']);
        //    document.getElementById(data['selectActionData']).innerHTML = fileUrl;
        //}
    </script>
    <style type="text/css">
        #Editor {
            height: 400px;
            width: 700px;
        }
    </style>
</head>
<body>
    <div class="container" style="padding-top: 25px;">
        <div class="alert alert-info">
            توجه : اگر متن مورد نظر را از محلی کپی می فرمایید ابتدا در برنامه notpad وارد نمایید و سپس از notpad&nbsp; در این محل past نمایید
        </div>
        <form id="form1" >
            <input type="hidden" id="companyID" name="companyID" />
            <div class="row">
                <div class="col-md-4 form-group">
                    <label>محل نمایش</label>
                    <select id="loaction" name="D1"  class="form-control">
                        <option value="0">صفحه جدید</option>
                        <option value="1">صفحه اصلی</option>
                        <option value="2">صفحه نتیجه جستجو</option>
                        <option value="3">صفحه سبد خرید</option>
                        <option value="4">داخل فوتر سایت</option>
                        <option value="5">داخل هدر سایت</option>
                        <option value="6">صفجه خرید های من</option>
                        <option value="7">داخل تصویر جستجو صفحه اصلی</option>
                    </select>
                </div>
                <div class="col-md-4 form-group" id="SystemName">
                    <label>زیر مجموعه منو</label>
                    <select id="SystemCode" name="SystemCode"  class="form-control">
                        <option value="1">منو 1</option>
                        <option value="2">منو 2</option>
                        <option value="3">منو 3</option>
                        <option value="4">منو 4</option>
                        <option value="5">منو 5</option>
                       
                    </select>
                </div>
                <div class="col-md-4 form-group" id="title">
                    <label>عنوان صفحه در منو</label>
                    <input type="text" class="form-control" id="menu" name="menu" />
                </div>
                

            </div>
            <div class="row">
                    <div class="col-md-12  form-group">
                        <label>محتوا صفحه</label>
                        <textarea id="Editor" name="Editor" style="height: 400px; width: 800px;"></textarea>

                    </div>
            </div>
            <div class="row">
                <div class="col-md-4  form-group">
                    <div id="alert"></div>
                    <input class="btn btn-dark" id="btnSabt" type="button" value="ثبت محتویات" />

                </div>

            </div>



        </form>
    </div>
    <div id="target"></div>
    <script type="text/javascript">
        var URL = "http://api.nikoooo.ir/api/";
        //var URL = "http://localhost:11938/api/"
        $(document).ready(function () {

            //-------------نصب ckeditor---------------------+
            //var newCKEdit = CKEDITOR.replace('Editor');
            var newCKEdit =CKEDITOR.replace('Editor',
                {
                    filebrowserBrowseUrl: '/ckfinder/ckfinder.html',
                    filebrowserImageBrowseUrl: '/ckfinder/ckfinder.html?type=Images',
                    filebrowserFlashBrowseUrl: '/ckfinder/ckfinder.html?type=Flash',
                    filebrowserUploadUrl: '/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Files',
                    filebrowserImageUploadUrl: '/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Images',
                    filebrowserFlashUploadUrl: '/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Flash'
                });
            //---------------نصب ckfinder-------------------+
            CKFinder.setupCKEditor(newCKEdit, 'ckfinder/');
        });
        $('#loaction').on('change', function () {
            if (this.value != '0') {

                document.getElementById("title").style.display = "none";
                document.getElementById("SystemName").style.display = "none";
                $('#menu').val('')
                $('#SystemCode').val('')
            }
            else {
                document.getElementById("title").style.display = "block";
                document.getElementById("SystemName").style.display = "block";
            }

        });
        $(window).on("load", function () {

            var id = getUrlVars()["id"];
            var CompanyID = getUrlVars()["companyId"];

            $('#companyID').val(CompanyID);
            if (id != undefined && id != '') {


                $.ajax({
                    type: "Get",
                    url: URL + "SelectPageGenerator/Get",
                    data: { Lang: 'fa', UserName: '', id: id },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (data != undefined) {
                            $('#loaction').val(data[0].PageLocationID);
                            $('#menu').val(data[0].PageTitle);
                            $('#SystemCode').val(data[0].PageSystemCode)

                            var oEditor = CKEDITOR.instances.Editor;
                            var editor = oEditor.setData(data[0].PageContent);
                            if (data[0].PageLocationID != '0') {
                                document.getElementById("title").style.display = "none";
                                document.getElementById("SystemName").style.display = "none";
                                $('#menu').val('')
                                $('#SystemCode').val('')
                            }
                        }


                    },
                });
            }

        })
        function getUrlVars() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }

        $('#btnSabt').click(function () {
            $('#alert').html('');
            var isTrue = 1;
            //----------- گرفتن مقادیر -----------+
            var oEditor = CKEDITOR.instances.Editor;
            var editor = oEditor.getData();
            if (editor != '' && $('#loaction').val() != '' && (($('#menu').val() != '' && $('#SystemCode').val() != '' && $('#loaction').val() == '0') || $('#loaction').val() != '0')) {
                isTrue = 1;
            }
            else {
                $('#alert').html('<p class="alert alert-danger">تمام اطلاعات در صفحه را پر نمایید</p>')
                isTrue = 0;
            }
            if (isTrue == 1) {


                //-------------  ارسال --------------+
                if (getUrlVars()["id"] != undefined && getUrlVars()["id"] != '') {

                    var input = {
                        'CompanyID': $('#companyID').val(),
                        'ID': getUrlVars()["id"],
                        'PageContent': editor,
                        'PageLocationID': $('#loaction').val(),
                        'PageLocation': $("#loaction option:selected").text(),
                        'PageTitle': $('#menu').val(),
                        'PageSystemCode':$('#SystemCode').val()
                    };
                    var posting = $.post(URL + "/UpdatePageGenerator/Post", input).done(function () {

                        $('#alert').html('<p class="alert alert-info">عمل ثبت با موفقیت انجام شد</p>')

                    }).fail(function () {

                        $('#alert').html('<p class="alert alert-danger">خطا در انجام عملیات</p>')

                    })
                }
                else {
                    var input = {
                        'CompanyID': $('#companyID').val(),

                        'PageContent': editor,
                        'PageLocationID': $('#loaction').val(),
                        'PageLocation': $("#loaction option:selected").text(),
                        'PageTitle': $('#menu').val(),
                        'PageSystemCode':$('#SystemCode').val()
                    };
                    var posting = $.post(URL + "/InsertPageGenerator/Post", input).done(function () {

                        $('#alert').html('<p class="alert alert-info">عمل ثبت با موفقیت انجام شد</p>')

                    }).fail(function () {

                        $('#alert').html('<p class="alert alert-danger">خطا در انجام عملیات</p>')

                    })
                }
            }
        });
    </script>
</body>
</html>
