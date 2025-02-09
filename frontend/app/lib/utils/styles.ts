export function HEXToVBColor(rrggbb: string) {
    var bbggrr = rrggbb.substring(4, 6) + rrggbb.substring(2, 4) + rrggbb.substr(0, 2);
    return parseInt(bbggrr, 16)
}

export function VBColorToHEX(i: number) {
    var bbggrr = ("000000" + i.toString(16)).slice(-6);
    var rrggbb = bbggrr.substring(4, 6) + bbggrr.substring(2, 4) + bbggrr.substr(0, 2);
    return "#" + rrggbb;
}

export function RGBToHEX(rgb_: string) {
    var rgb = rgb_.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

export function HEXToRGB(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
}

export function HEXToRGBA(hex: string, alpha: number) {
    var rgb = HEXToRGB(hex);
    return rgb ? `rgba(${rgb.substring(4, rgb.length - 1)}, ${alpha})` : null;
}

export function RGBToRGBA(rgb: string, alpha: number) {
    return `rgba(${rgb.substring(4, rgb.length - 1)}, ${alpha})`
}