//Main entry point!

(function ($, OliveUI) {

  var oliveUI = OliveUI();

  $('#main').append(
    oliveUI.render()
  );

  var widget1 = oliveUI.createWidgetInstance('Microservice UI');
  var widget2 = oliveUI.createWidgetInstance('Microservice UI');
  var widget3 = oliveUI.createWidgetInstance('Javascript Render UI');
  var widget4 = oliveUI.createWidgetInstance('HTML Render UI');
  var widget5 = oliveUI.createWidgetInstance('Markdown Render UI');
  var widget6 = oliveUI.createWidgetInstance('Grid Widget');
  var widget7 = oliveUI.createWidgetInstance('Grid Widget');



  oliveUI.setWidgetInstanceConfiguration(widget1, {
    microserviceInputs: {
      'Append Text': {
        value: 'World'
      }
    },
    microserviceOutputAdaptAlg: '',
    serviceName: 'Test 1'
  });

  oliveUI.setWidgetInstanceConfiguration(widget2, {
    microserviceInputs: {
      'Append Text': {
        value: 'Microservice result'
      }
    },
    microserviceOutputAdaptAlg: 'return output.dataText;',
    serviceName: 'Test 2'
  });

  oliveUI.setWidgetInstanceConfiguration(widget3, {
    javascriptAlg: `//You must return a dom object
return $('<button>This is a javascript generated button</button>').click(function () {
  alert('Button clicked');
});`
  });

  oliveUI.setWidgetInstanceConfiguration(widget4, {
    html: `<blockquote><b>This is a Bold HTML text</b></blockquote>`
  });

  oliveUI.setWidgetInstanceConfiguration(widget5, {
    text: `# This is a markdown text`
  });

  oliveUI.setWidgetInstanceConfiguration(widget6, {
    indexurl:"https://api.github.com/repositories/175385549/contents/js",
    indexfilename:"indexlist2",
    token:"9e8b86265ce1566de543cb526933266aafe12ac5",
    type:"JobTile"

  });

  oliveUI.setWidgetInstanceConfiguration(widget7, {
    indexurl:"https://api.github.com/repositories/175385549/contents/js",
    indexfilename:"indexlist2",
    token:"9e8b86265ce1566de543cb526933266aafe12ac5",
    type:"EventTile"

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

}(jQuery, OliveUI));
