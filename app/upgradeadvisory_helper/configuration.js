module.exports={
    ua:{
        dbms:{
            oracle:{ component_query: 'queries/application_versions.sql'},
            mssql: { component_query: 'queries/application_versions_msql.sql'}
        }
    },
    upload:{
        directory:'',
        

    },
    root_dir: __dirname
}