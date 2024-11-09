export const userIdGen = (name, role = 'Student') => {
    const nameTag = name.substring(0, 3);
    const roleCode = role.substring(0, 2) + role.substr(-1, 1);
    const year = new Date().getFullYear().toString().substring(2);
    const month = new Date().getMonth() + 1;
    const random = Math.floor(Math.random() * (100000 - 20000)) + 20000;
    const id = nameTag + year + (month < 10 ? '0' + month : month) + random + roleCode;
    return id.toUpperCase();
}

export const centreIdGen = (city = 'New Delhi') => {
    const cityTag = city.substring(0, 3);
    const centreId = Math.floor(Math.random() * 1000000) + 1;
    const year = new Date().getFullYear().toString().substring(2);
    const centreID = cityTag + centreId + year;
    return centreID.toUpperCase();
}