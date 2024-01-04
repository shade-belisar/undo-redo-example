import CustomPalette from "./CustomPalette";
import CustomPaletteProvider from "./CustomPaletteProvider";

export default {
    __init__: ["CustomPalette", "CustomPaletteProvider"],
    CustomPalette: ["type", CustomPalette],
    CustomPaletteProvider: ["type", CustomPaletteProvider]
};
