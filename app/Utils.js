export function isBlank(string) {
    if (!string) {
        return true
    }
    const trimmed = string.trim()
    return !trimmed;
}
