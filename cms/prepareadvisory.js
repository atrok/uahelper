{
	header: {
		name: 'Upgrade Advisory tool'
	},
	side_menu_item: [
		{
			link: '/prepareadvisory?start',
			description: 'Start'
		},
		{
			link: '/prepareadvisory?test',
			description: 'Test'
		},
		{
			link: '/prepareadvisory?recreate',
			description: 'Recreate views'
		}
	],
	instruction_points: {
		header: '',
		tagline: '',
		link: ''
	},
	form_comp:{
		header:"Select component",
		ostype: [

            { typeid:1	, lc_value:'Solaris', name:'solaris'},
            { typeid:2	, lc_value:'Solaris x86', name:'solaris'},
            { typeid:3	, lc_value:'Tru64 Unix', name:'trux'},
            { typeid:4	, lc_value:'HP-UX', name:'hpux'},
            { typeid:5	, lc_value:'IBM AIX', name:'aix'},
            { typeid:6	, lc_value:'SunOS', name:'sunos'},
            { typeid:7	, lc_value:'Windows NT', name:'windows'},
            { typeid:8	, lc_value:'Windows', name:'windows'},
            { typeid:9	, lc_value:'IBM OS2', name:'ibmos2'},
            { typeid:10	, lc_value:'Macintosh', name:'macintosh'},
            { typeid:11	, lc_value:'Tandem UNIX', name:'tandemux'},
            { typeid:12	, lc_value:'UNIX Ware', name:'uxware'},
            { typeid:13	, lc_value:'Windows 2000', name:'windows'},
            { typeid:14	, lc_value:'Windows XP', name:'windows'},
            { typeid:15	, lc_value:'Windows Server 2003', name:'windows'},
            { typeid:16	, lc_value:'RedHat Enterprise Linux AS/Intel', name:'linux'},
            { typeid:17	, lc_value:'Windows Server 2008', name:'windows'},
            { typeid:18	, lc_value:'Windows Vista', name:'windows'},
            { typeid:19	, lc_value:'Windows Server 2012', name:'windows'}
			],
		apptype:[
			{"name":".NET Web API Server and Samples","value":4},
			{"name":"Aastra MXONE CSTA I","value":11},
			{"name":"Administration Console","value":4},
			{"name":"Alcatel A4400/OXE","value":28},
			{"name":"API","value":5},
			{"name":"Aspect ACD","value":12},
			{"name":"Authoring Tool","value":22},
			{"name":"Avaya Communication Manager","value":34},
			{"name":"Avaya TSAPI","value":19},
			{"name":"Backend","value":18},
			{"name":"Builder","value":24},
			{"name":"Business Process for use with Facebook","value":8},
			{"name":"Business Process for use with RSS","value":4},
			{"name":"Business Process for use with Twitter","value":7},
			{"name":"Call Control Platform","value":15},
			{"name":"Call Progress Detection Server","value":4},
			{"name":"CCPulse+","value":10},
			{"name":"Chat Server","value":4},
			{"name":"Cisco Adapter","value":5},
			{"name":"Classification Server","value":4},
			{"name":"Configuration Manager","value":5},
			{"name":"Configuration Server","value":33},
			{"name":"Configuration Utility","value":14},
			{"name":"Contact Center Advisor - Mobile Edition","value":4},
			{"name":"Contact Center Advisor - Mobile Edition Android Client","value":1},
			{"name":"Contact Center Advisor - Mobile Edition Blackberry Client","value":3},
			{"name":"Contact Center Advisor - Mobile Edition iOS Client","value":4},
			{"name":"Contact Center Advisor & Workforce Advisor","value":14},
			{"name":"CSTA Connector","value":17},
			{"name":"CSTA Connector for BroadSoft BroadWorks","value":16},
			{"name":"CTI Connector","value":25},
			{"name":"Custom Server","value":5},
			{"name":"Daemon","value":4},
			{"name":"Data Aggregator","value":27},
			{"name":"Data Mart","value":2},
			{"name":"Data Modeling Assistant","value":4},
			{"name":"Data Sourcer","value":2},
			{"name":"Database Utility","value":11},
			{"name":"DB Server","value":17},
			{"name":"Development Tool","value":13},
			{"name":"Device Management Plug-in for Genesys Administrator Extension","value":16},
			{"name":"E-mail Server","value":13},
			{"name":"EADS Intecom M6880","value":6},
			{"name":"Engine","value":11},
			{"name":"Fetching Module","value":2},
			{"name":"Frontend","value":18},
			{"name":"Frontline Advisor and Agent Advisor","value":15},
			{"name":"Genesys Adapter","value":13},
			{"name":"Genesys Administrator","value":39},
			{"name":"Genesys Administrator Extension","value":33},
			{"name":"Genesys Administrator Extension HPE SPD","value":14},
			{"name":"Genesys Agent Scripting","value":20},
			{"name":"Genesys Co-browse Server","value":5},
			{"name":"Genesys Driver for Use with Facebook","value":19},
			{"name":"Genesys Driver for Use with RSS","value":3},
			{"name":"Genesys Driver for Use with Twitter","value":16},
			{"name":"Genesys Info Mart","value":36},
			{"name":"Genesys Interactive Insights","value":27},
			{"name":"Genesys One Base Pack","value":4},
			{"name":"Genesys One Email Pack","value":4},
			{"name":"Genesys One HA Pack","value":2},
			{"name":"Genesys Pulse","value":3},
			{"name":"Genesys Pulse Collector","value":4},
			{"name":"Genesys Quality Management","value":33},
			{"name":"Genesys SIP Voicemail","value":3},
			{"name":"Genesys SIP Voicemail Complete Install","value":4},
			{"name":"Hosted Provider Edition","value":7},
			{"name":"Hosted Provider Edition Agent Desktop Proxy","value":4},
			{"name":"Interaction Routing Designer","value":18},
			{"name":"Interaction Server","value":35},
			{"name":"Interaction Server Proxy","value":5},
			{"name":"Interaction Workflow Samples","value":2},
			{"name":"Interaction Workspace","value":64},
			{"name":"Interaction Workspace Plug-in for Facebook","value":8},
			{"name":"Interaction Workspace Plug-in for Genesys Agent Scripting","value":18},
			{"name":"Interaction Workspace Plug-in for RSS","value":2},
			{"name":"Interaction Workspace Plug-in for Twitter","value":8},
			{"name":"IVR Driver for MPS","value":2},
			{"name":"IVR Driver for WVR for AIX","value":3},
			{"name":"IVR Library","value":2},
			{"name":"IVR SDK","value":2},
			{"name":"IVR Server","value":9},
			{"name":"iWD Data Mart","value":15},
			{"name":"iWD Manager","value":15},
			{"name":"iWD Runtime Node","value":15},
			{"name":"iWD Setup Utility","value":3},
			{"name":"Java Environment and Libraries for eServices and UCS","value":2},
			{"name":"Knowledge Manager","value":4},
			{"name":"License Reporting Manager","value":9},
			{"name":"Load Distribution Server","value":14},
			{"name":"Local Control Agent","value":11},
			{"name":"Manager","value":3},
			{"name":"Media Control Platform","value":108},
			{"name":"Message Server","value":7},
			{"name":"MIB","value":9},
			{"name":"Mitel MiTAI","value":3},
			{"name":"Mitel MiVoice","value":2},
			{"name":"MRCP Proxy","value":5},
			{"name":"Multi-Channel Routing Extensions","value":1},
			{"name":"NEC NEAX/APEX","value":24},
			{"name":"Nortel Communication Server 1000 with SCCS/MLS","value":16},
			{"name":"Nortel Communication Server 2000/2100","value":13},
			{"name":"Orchestration Server","value":110},
			{"name":"Outbound Contact Center Extension","value":4},
			{"name":"Outbound Contact Server","value":68},
			{"name":"Platform","value":14},
			{"name":"Platform SDK & Application Blocks for .NET","value":21},
			{"name":"Platform SDK & Application Blocks for Java","value":19},
			{"name":"Plug-in for GAX","value":2},
			{"name":"Plug-in for Genesys Administrator Extension","value":39},
			{"name":"Plug-in for Interaction Workspace","value":21},
			{"name":"Plug-in for Workspace Desktop Edition","value":12},
			{"name":"Policy Server","value":4},
			{"name":"PSTN Connector","value":13},
			{"name":"Reporting and Analytics Aggregates","value":21},
			{"name":"Reporting Plug-in for GAX","value":3},
			{"name":"Reporting Server","value":26},
			{"name":"Resource Manager","value":53},
			{"name":"Sample Reporting Templates","value":22},
			{"name":"SAP BusinessObjects Business Intelligence Platform Client 3.1.x","value":2},
			{"name":"SAP BusinessObjects Business Intelligence Platform Client 4.1.x","value":3},
			{"name":"SAP BusinessObjects Business Intelligence Platform Client ServicePack 3.1.x","value":2},
			{"name":"SAP BusinessObjects Business Intelligence Platform Client ServicePack 4.1.x","value":2},
			{"name":"SAP BusinessObjects Business Intelligence Platform Server 3.1.x","value":3},
			{"name":"SAP BusinessObjects Business Intelligence Platform Server 4.1.x","value":3},
			{"name":"SAP BusinessObjects Business Intelligence Platform Server Service Pack 3.1.x","value":2},
			{"name":"SAP BusinessObjects Business Intelligence Platform Server ServicePack 4.1.x","value":2},
			{"name":"Security Pack on UNIX","value":8},
			{"name":"Server","value":39},
			{"name":"Siemens HiPath 4000 CSTA III","value":11},
			{"name":"SIP Endpoint SDK for .NET","value":5},
			{"name":"SIP Endpoint SDK for Apple OS","value":2},
			{"name":"SIP Feature Server","value":55},
			{"name":"SIP Proxy","value":21},
			{"name":"SIP Server","value":226},
			{"name":"sipspan2","value":5},
			{"name":"SMS Server","value":15},
			{"name":"SNMP Master Agent","value":6},
			{"name":"Social Messaging Plugin for Genesys Agent Desktop","value":4},
			{"name":"Social Messaging Server","value":8},
			{"name":"Solution Control Server","value":19},
			{"name":"Spectrum","value":5},
			{"name":"Stat Server","value":41},
			{"name":"Supplementary Services Gateway","value":10},
			{"name":"T-Server Common Part","value":91},
			{"name":"T-Server-CUCM to Media Server Connector","value":5},
			{"name":"Third-Party Squid","value":7},
			{"name":"Training Server","value":2},
			{"name":"UCS Manager","value":5},
			{"name":"Universal Contact Server","value":17},
			{"name":"Universal Contact Server Proxy","value":7},
			{"name":"Universal Routing Server","value":58},
			{"name":"Web","value":34},
			{"name":"Web API Server","value":5},
			{"name":"Web API Server for WebLogic","value":3},
			{"name":"Web API Server for WebSphere","value":3}
			]
		}

}