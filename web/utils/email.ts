const getDomain = (email: string): string => {
    const reg = /@.*\./;
    var groups = email.match(reg);
    if (groups) {
        var group = groups[0];
        var domainString = group.slice(1, -1);
        return domainString;
    }
    return '';
}

export default getDomain;