export const getString = (string: any, start: string, end: string, i: number) => {
    i++;
    var str = string.split(start);
    var str = str[i].split(end);
    return str[0];
};