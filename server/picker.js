Picker.route('/package-status/:name/:version/:status',
  function(params, req, res, next) {
    Packages.upsert(
      { name: params.name },
      { $set: { 
        status: params.status,
        version: params.version }
      }
    );
    res.end("OK");
  }
);
