export default function getInputWidth(value, windowWidth) {
    return String(value).length > 1 ? (String(value).length * (windowWidth === "medium" ? 25 : (windowWidth === "small" ? 16 : 32))) * (String(value).length > 1 ? 0.85 : 0) : (windowWidth === "medium" ? 25 : (windowWidth === "small" ? 16 : 32));
}