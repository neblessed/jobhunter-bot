class FilterActions {
    position = {
        qa: 'qaEngineer',
        aqa: 'aqaEngineer',
        feDev: 'frontDev',
        beDev: 'backDev'
    };

    grade = {
        trainee: 'trainee',
        junior: 'junior',
        middle: 'middle',
        senior: 'senior',
        lead: 'lead'
    }

    location = {
        noMatter: 'locationNoMatter',
        ru: 'locationRussia',
        rb: 'locationBelarus',
        kz: 'locationKazakhstan',
        rs: 'locationSerbia',
        tr: 'locationTurkey',
        de: 'locationGermany',
        uk: 'locationEngland',
        usa: 'locationUSA'
    }

    type = {
        noMatter: 'typeNoMatter',
        remote: 'remote',
        hybrid: 'hybrid',
        office: 'office'
    }

    salary = {
        noMatter: 'noMatterK',
        k80: '50-80k',
        k150: '100-150k',
        k250: '150-250k',
    }

    programmingLanguage = {
        noMatter: 'langNoMatter',
        java: 'java',
        python: 'python',
        jsTs: 'js-ts',
        kotlin: 'kotlin',
        golang: 'golang',
        c: 'c'
    }
}

export const actions = new FilterActions();