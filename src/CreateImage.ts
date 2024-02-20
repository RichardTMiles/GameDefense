

export async function createImage() {
    if (typeof Image !== 'undefined') {
        return new Image();
    } else {
        const { Image } = await require('react-native-canvas');
        return new Image();
    }
}
