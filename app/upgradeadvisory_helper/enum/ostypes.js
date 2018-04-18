class OSTypes {

    constructor() {
        this.types = [
            { typeid: 0, lc_value: 'Unknown OS Type', name: 'Unknown OS Type' },
            { typeid: 1, lc_value: 'Solaris', name: 'solaris' },
            { typeid: 2, lc_value: 'Solaris x86', name: 'solaris' },
            { typeid: 3, lc_value: 'Tru64 Unix', name: 'trux' },
            { typeid: 4, lc_value: 'HP-UX', name: 'hpux' },
            { typeid: 5, lc_value: 'IBM AIX', name: 'aix' },
            { typeid: 6, lc_value: 'SunOS', name: 'sunos' },
            { typeid: 7, lc_value: 'Windows NT', name: 'windows' },
            { typeid: 8, lc_value: 'Windows', name: 'windows' },
            { typeid: 9, lc_value: 'IBM OS2', name: 'ibmos2' },
            { typeid: 10, lc_value: 'Macintosh', name: 'macintosh' },
            { typeid: 11, lc_value: 'Tandem UNIX', name: 'tandemux' },
            { typeid: 12, lc_value: 'UNIX Ware', name: 'uxware' },
            { typeid: 13, lc_value: 'Windows 2000', name: 'windows' },
            { typeid: 14, lc_value: 'Windows XP', name: 'windows' },
            { typeid: 15, lc_value: 'Windows Server 2003', name: 'windows' },
            { typeid: 16, lc_value: 'RedHat Enterprise Linux AS/Intel', name: 'linux' },
            { typeid: 17, lc_value: 'Windows Server 2008', name: 'windows' },
            { typeid: 18, lc_value: 'Windows Vista', name: 'windows' },
            { typeid: 19, lc_value: 'Windows Server 2012', name: 'windows' }
        ];
    }

    findByTypeID(id) {
        var type = this.types;
        try {
            id = parseInt(id);
            if (typeof id === 'number') {

                for (var i = 0; i < type.length; i++) {
                    if (id === type[i].typeid)
                        return type[i];
                }
                
            }
            return null;
        } catch (e) {
            console.log(e.stack);
            throw e;
        }


    }

    findByName(name) {
        var type = this.types;
        for (var i = 0; i < type.length; i++) {
            if (name === type[i].lc_value)
                return type[i];
        }
        return null;
    }


}

module.exports = OSTypes;