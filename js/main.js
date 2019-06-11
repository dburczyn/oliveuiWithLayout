//Main entry point!

(function ($, OliveUI) {

  var oliveUI = OliveUI();

  $('#main').append(
    oliveUI.render()
  );



    var widget1 = oliveUI.createWidgetInstance('Grid Widget');
  //  var widget2 = oliveUI.createWidgetInstance('Markdown Render UI');
    var widget2 = oliveUI.createWidgetInstance('Grid Widget');
    var widget3 = oliveUI.createWidgetInstance('Grid Widget');

/// here is the initial configuration of widget instance(s)
  oliveUI.setWidgetInstanceConfiguration(widget1, {
    indexurl:"https://api.github.com/repositories/175385549/contents/js",
    indexfilename:"indexlist",
    type:"JobTile",
    secret:"1945319cd07efdad529f45119267792ddf2974b4",
    client:"1777413b1f15516dca79",
  });

  oliveUI.setWidgetInstanceConfiguration(widget2, {
    indexurl:"https://api.github.com/repos/bocbrokeragetest/brokerage/contents/repodata",
    indexfilename:"indexlist",
    type:"TrainingTile",
    secret:"1945319cd07efdad529f45119267792ddf2974b4",
    client:"1777413b1f15516dca79"
  });

  oliveUI.setWidgetInstanceConfiguration(widget3, {
    indexurl:"https://api.github.com/repos/bocbrokeragetest/brokerage/contents/repodata",
    indexfilename:"indexlist",
    type:"EventTile",
    secret:"1945319cd07efdad529f45119267792ddf2974b4",
    client:"1777413b1f15516dca79"
  });







  // var toSave = oliveUI.getContent();
  // console.log(toSave);
  // oliveUI.setContent(toSave);


  $('#main').prepend(
    $('<button>Download</button>').click(function () {
      $( ".lm_header" ).hide();
      OliveUI.utils.download(JSON.stringify(oliveUI.getContent()), 'oliveui_backup_' + new Date().toISOString() + '.json', 'application/json');
    }),
    $('<button>Upload</button>').click(function () {
      $( ".lm_header" ).show();
      $('#fileUpload').trigger('click');

    }),
    $('<input id="fileUpload" type="file" style="display: none;">').change(function (e) {
      var fileName = e.target.files[0].name;
      OliveUI.utils.readFileAsArrayBuffer(e.target.files[0], function (content) {
        oliveUI.setContent(JSON.parse(OliveUI.utils.ab2str(content)));
      });
    })
  );



  function addGithubLoginForm(gridrendercontent) {
    var user = document.createElement('input');
    var pass = document.createElement('input');
    var gettokenbutton = document.createElement('button');
    var configform = document.createElement('form');
    var secret = "";
    var client = "";
    $(configform)
      .prependTo($('#main'))
      .addClass("form-style-5")
      .append(
        $('<p/>')
        .text("Username:")
      )
      .append(
        $(user)
        .attr("type", "text")
      )
      .append(
        $('<p/>')
        .text("Password:")
      )
      .append(
        $(pass)
        .attr("type", "text")
      )
      .append(
        $(gettokenbutton)
        .text("Log in")
      );
    $(gettokenbutton)
      .unbind('click')
      .on('click', function (e) {
        e.preventDefault();
        var splitname = gridrendercontent.indexurl.split("contents")[0];
        $.ajax({
            url: "https://api.github.com/authorizations/clients/" + client,
            beforeSend: function (xhr) {
              xhr.setRequestHeader("Authorization", "Basic " + btoa($(user).val() + ":" + $(pass).val()));
            },
            dataType: 'json',
            type: 'PUT',
            data: '{"client_secret": "' + secret + '","scopes": ["public_repo"],"note": "admin script","fingerprint":"' + new Date().getTime() + '"}'
          })
          .done(function (response) {
            // config.setcontent (client secret user pass)
            if (response.permission === "admin") {
              OliveUI.isadmin = true;
            }
          });
      });
  }







//   setTimeout(function() {
//     $('.glyphicon-refresh').trigger('click');
//  }, 3000);

// $(function() {

// $('.glyphicon-refresh').trigger('click');
// });


}(jQuery, OliveUI));
