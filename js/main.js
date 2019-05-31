//Main entry point!

(function ($, OliveUI) {

  var oliveUI = OliveUI();

  $('#main').append(
    oliveUI.render()
  );


  var widget1 = oliveUI.createWidgetInstance('Grid Widget');


/// here is the initial configuration of widget instance(s)
  oliveUI.setWidgetInstanceConfiguration(widget1, {
    indexurl:"https://api.github.com/repos/bocbrokeragetest/brokerage/contents/repodata",
    indexfilename:"indexlist",
    type:"JobTile"
  });


  var toSave = oliveUI.getContent();
  // console.log(toSave);
  oliveUI.setContent(toSave);


  $('#main').prepend(
    $('<button>Download</button>').click(function () {
      OliveUI.utils.download(JSON.stringify(oliveUI.getContent()), 'oliveui_backup_' + new Date().toISOString() + '.json', 'application/json');
    }),
    $('<button>Upload</button>').click(function () {
      $('#fileUpload').trigger('click');

    }),
    $('<input id="fileUpload" type="file" style="display: none;">').change(function (e) {
      var fileName = e.target.files[0].name;
      OliveUI.utils.readFileAsArrayBuffer(e.target.files[0], function (content) {
        oliveUI.setContent(JSON.parse(OliveUI.utils.ab2str(content)));
      });
    })
  );


  setTimeout(function() {
    $('.glyphicon-refresh').trigger('click');
 }, 3000);


}(jQuery, OliveUI));
