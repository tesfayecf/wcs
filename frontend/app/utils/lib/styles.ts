export function HEXToVBColor(rrggbb: string) {
    var bbggrr = rrggbb.substring(4, 6) + rrggbb.substring(2, 4) + rrggbb.substr(0, 2);
    return parseInt(bbggrr, 16)
}

export function VBColorToHEX(i: number) {
    var bbggrr = ("000000" + i.toString(16)).slice(-6);
    var rrggbb = bbggrr.substring(4, 6) + bbggrr.substring(2, 4) + bbggrr.substr(0, 2);
    return "#" + rrggbb;
}