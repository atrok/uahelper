const view_names = [
    {
      name: 'all', flag: 0x1, function: {
        all: {
          map: function (doc) {
            emit(doc["component"], doc);
          }
        }
      }
    },
    {
      name: "group-releases-by-component", flag: 0x2, function: {
        "group-releases-by-component": {
          map: function (doc) {
            if (doc.release && doc.component) {
              emit([doc.component, doc.release], 1);
            }
          },
          reduce: function (keys, values) {
            return sum(values);
          }
        }
      }
    },
    {
      name: "features-by-release", flag: 0x4, function: {
        "features-by-release": {
          map: function (doc) {
            var os = [];
            if (doc.windows) {
              if (doc.windows === 'X') {
                os.push('windows');
              }
            }
            if (doc.linux) {
              if (doc.linux === 'X') {
                os.push('linux');
              }
            }
  
            if (doc.solaris) {
              if (doc.solaris === 'X') {
                os.push('solaris');
              }
            }
  
            if (doc.aix) {
              if (doc.aix === 'X') {
                os.push('aix');
              }
            }
  
            if (doc['HP-UX']) {
              if (doc['HP-UX'] === 'X') {
                os.push('hpux');
              }
            }
  
            if (doc.hpuxpa||doc.hpuxipf) {
              if (doc.hpuxpa === 'X'||doc.hpuxipf==='X') {
                os.push('hpux');
              }
            }
  
  
            if (doc['TRUE64 UNIX']) {
              if (doc['TRUE64 UNIX'] === 'X') {
                os.push('trux');
              }
            }
  
            for (var i = 0, l = os.length; i < l; i++) {
              if (doc.release && doc.component) {
                var family = doc.release.slice(0, 3);
                emit([doc.component, os[i], doc.release, doc.restricted], {
                  _id: doc._id,
                  _rev: doc._rev,
                  aix: doc.aix,
                  component: doc.component,
                  'component-href': doc['component-href'],
                  family: family,
                  'family-href': doc['family-href'],
                  features: doc.features,
                  bugfixes: doc.bugfixes,
                  linux: doc.linux,
                  release: doc.release,
                  release_date: doc.release_date,
                  release_type: doc.release_type,
                  'release-link-href': doc['release-link-href'],
                  restrictions: doc.restrictions,
                  solaris: doc.solaris,
                  solution_name: doc.solution_name,
                  upgrade_notes: doc.upgrade_notes,
                  'web-scraper-start-url': doc['web-scraper-start-url'],
                  windows: doc.windows
                });
              }
            }
          }
        }
      }
    },
    {
      name: "short-release-info", flag: 0x8, function: {
        "short-release-info": {
          map: function (doc) {
            if (doc.release && doc.component) {
              var family = doc.release.slice(0, 3);
              emit([doc.component, doc.release, family, doc.release_date, doc.release_type], 1);
            }
          },
          reduce: function (keys, values) {
            return sum(values);
          }
        }
      }
    },
    {
      name: "group-releases-by-family", flag: 0x10, function: {
        "group-releases-by-family": {
          map: function (doc) {
            if (doc.release) {
              var family = doc.release.slice(0, 3);
              var os = [];
              if (doc.windows) {
                if (doc.windows === 'X') {
                  os.push('windows');
                }
              }
              if (doc.linux) {
                if (doc.linux === 'X') {
                  os.push('linux');
                }
              }
  
              if (doc.solaris) {
                if (doc.solaris === 'X') {
                  os.push('solaris');
                }
              }
  
              if (doc.aix) {
                if (doc.aix === 'X') {
                  os.push('aix');
                }
              }
  
              if (doc['HP-UX']) {
                if (doc['HP-UX'] === 'X') {
                  os.push('hpux');
                }
              }
  
              if (doc.hpuxpa||doc.hpuxipf) {
                if (doc.hpuxpa === 'X'||doc.hpuxipf==='X') {
                  os.push('hpux');
                }
              }
    
              if (doc['TRUE64 UNIX']) {
                if (doc['TRUE64 UNIX'] === 'X') {
                  os.push('trux');
                }
              }
  
              for (var i = 0, l = os.length; i < l; i++) {
                emit([doc.component, os[i], family, doc.release, doc.release_date, doc.release_type], 1);
              }
            }
          },
          reduce: function (keys, values) {
            return sum(values);
          }
        }
      }
    }
  ];

  module.exports=view_names;