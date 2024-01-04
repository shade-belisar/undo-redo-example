/**
 * The palette expects an image to be used for the entries.
 * Since that doesn't really work for the modules,
 * this function creates an image containing the given text.
 */
export function createImage(text) {
    // Value depending on but not equal to the width of the palette
    const max_width = 190;
    const fontSize = 14;
    const lines = [];
    let result;
    let i, j;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = fontSize + "px Arial";

    // Calculation to split the text into separate lines
    // based on the width of the palette.
    while (text.length) {
        for (
            i = text.length;
            ctx.measureText(text.substring(0, i)).width > max_width;
            i--
        ) ;

        result = text.substring(0, i);

        if (i !== text.length)
            for (
                j = 0;
                result.indexOf(" ", j) !== -1;
                j = result.indexOf(" ", j) + 1
            ) ;

        lines.push(result.substring(0, j || result.length));
        text = text.substr(lines[lines.length - 1].length, text.length);
    }
    canvas.width = max_width + 40;
    canvas.height = 12 + (fontSize + 5) * lines.length;

    // Styling for border
    const inset = 3;
    const border_size = 1;
    ctx.fillStyle = "#000";
    ctx.fillRect(
        inset,
        inset,
        canvas.width - 1 - inset,
        canvas.height - 1 - inset
    );
    ctx.fillStyle = "#FFF";
    ctx.fillRect(
        inset + border_size,
        inset + border_size,
        canvas.width - 2 - (inset + border_size),
        canvas.height - 2 - (inset + border_size)
    );

    // Styling for text
    ctx.fillStyle = "#000";
    ctx.font = fontSize + "px Arial";
    ctx.textAlign = "center";

    for (i = 0, j = lines.length; i < j; ++i) {
        ctx.fillText(lines[i], canvas.width / 2, 9 + fontSize + (fontSize + 5) * i);
    }

    return canvas.toDataURL();
}
