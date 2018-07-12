const views_names= {
    maindDBall: {name: 'all', view: 'documents',path: function(){return this.view+'/'+this.name}, db:'genesys_releases'},
    group_releases_by_component: {name: 'group-releases-by-component', view: 'test', path: function(){return this.view+'/'+this.name},db:'genesys_releases'},
    features_by_release: {name: 'features-by-release', view: 'test', path: function(){return this.view+'/'+this.name},db:'genesys_releases'},
    short_release_info: {name: 'short-release-info', view: 'test', path: function(){return this.view+'/'+this.name},db:'genesys_releases'},
    group_releases_by_family : {name :'group-releases-by-family', view: 'test', path: function(){return this.view+'/'+this.name},db:'genesys_releases'},
    components_by_solutions : {name: 'components_by_solutions', view: 'test',path: function(){return this.view+'/'+this.name},db:'genesys_releases'},
    components_by_solutions_detailed : {name: 'components_by_solutions_detailed', view: 'test',path: function(){return this.view+'/'+this.name},db:'genesys_releases'},
    solutions: {name:'solutions', view: 'test',path: function(){return this.view+'/'+this.name},db:'genesys_releases'},
    solutions_by_components: {name:'solutions_by_components', view: 'test',path: function(){return this.view+'/'+this.name},db:'genesys_releases'},
}
const view_definitions = [
    {
      name: views_names.maindDBall.name, flag: 0x1, function: {
        all: {
          map: function (doc) {
            emit(doc["component"], doc);
          }
        }
      }, view: views_names.maindDBall.view
    },
    {
      name: views_names.group_releases_by_component.name, flag: 0x2, function: {
        [views_names.group_releases_by_component.name]: {
          map: function (doc) {
            if (doc.release && doc.component) {
              emit([doc.component, doc.release], 1);
            }
          },
          reduce: function (keys, values) {
            return sum(values);
          }
        }
      }, view: views_names.group_releases_by_component.view
    },
    {
      name: views_names.features_by_release.name, flag: 0x4, function: {
        [views_names.features_by_release.name]: {
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
                var solution_name=(doc.solution_name)?doc.solution_name : 'Unknown';
                emit([solution_name, doc.component, os[i], doc.release, doc.restricted], {
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
                  solution_name: solution_name,
                  upgrade_notes: doc.upgrade_notes,
                  'web-scraper-start-url': doc['web-scraper-start-url'],
                  windows: doc.windows
                });
              }
            }
          }
        }
      }, view: views_names.features_by_release.view
    },
    {
      name: views_names.short_release_info.name, flag: 0x8, function: {
        [views_names.short_release_info.name]: {
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
      }, view: views_names.short_release_info.view
    },
    {
      name: views_names.group_releases_by_family.name, flag: 0x10, function: {
        [views_names.group_releases_by_family.name]: {
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
                var solution_name=(doc.solution_name)?doc.solution_name : 'Unknown';
                emit([solution_name, doc.component, os[i], family, doc.release, doc.release_date, doc.release_type], 1);
              }
            }
          },
          reduce: function (keys, values) {
            return sum(values);
          }
        }
      },view: views_names.group_releases_by_family.view
    },
    {
        name: views_names.components_by_solutions.name, flag: 0x20, function: {
            [views_names.components_by_solutions.name]: {
                map: function (doc) {
                    var solution_name=(doc.solution_name)?doc.solution_name : 'Unknown';
                    emit([solution_name, doc.component], 1);
                  },
                  reduce: function (keys, values) {
                    return count(values);
                  } 
            }
        }, view: views_names.components_by_solutions.view
    },
    {
        name: views_names.solutions.name, flag: 0x40, function: {
            [views_names.solutions.name]:{
                map: function (doc) {
                    var solution_name=(doc.solution_name)?doc.solution_name : 'Unknown';
                    emit(solution_name, 1);
                  },
                reduce: function (keys, values) {
                    return count(values);
                  }
            }
        }, view: views_names.solutions.view
    },
    {
      name: views_names.solutions_by_components.name, flag: 0x80, function: {
          [views_names.solutions_by_components.name]: {
              map: function (doc) {
                  var solution_name=(doc.solution_name)?doc.solution_name : 'Unknown';
                  emit([doc.component, solution_name], 1);
                },
                reduce: function (keys, values) {
                  return count(values);
                } 
          }
      }, view: views_names.solutions_by_components.view
  },
  {
    name: views_names.components_by_solutions_detailed.name, flag: 0x100, function: {
        [views_names.components_by_solutions_detailed.name]: {
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
                  var solution_name=(doc.solution_name)?doc.solution_name : 'Unknown';
                  emit([solution_name, doc.component, os[i], family], 1);
                }
              }
            },
              reduce: function (keys, values) {
                return count(values);
              } 
        }
    }, view: views_names.components_by_solutions_detailed.view
}
  ];

  module.exports={view_definitions, views_names};