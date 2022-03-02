export default class OrientationFixer {
    /**
     * @param {File} file
     * @returns {Promise<int>}
     */
    async determineOrientation(file) {
        const data = await this._readFileToArrayBuffer(file);
        const dataView = new DataView(data);
        return this._isJpegFile(data, dataView) ? (this._getOrientationValueFromJpegData(dataView) || 1) : 1;
    };

    /**
     * @param {File} file
     * @returns {Promise<string>}
     */
    async getBase64Image(file) {
        const data = await this._readFileToArrayBuffer(file);
        return "data:" + file.type + ";base64," + window.btoa(String.fromCharCode(new Uint8Array(data)));
    }

    /**
     * @param {int} orientation
     */
    getCssTransformationByOrientationValue(orientation) {
        const map = {
            1: '',
            2: 'rotateY(180deg)',
            3: 'rotate(180deg)',
            4: 'rotate(180deg) rotateY(180deg)',
            5: 'rotate(270deg) rotateY(180deg)',
            6: 'rotate(90deg)',
            7: 'rotate(90deg) rotateY(180deg)',
            8: 'rotate(270deg)'
        };
        if (map[orientation] !== undefined) {
            return map[orientation];
        } else {
            console.error('Unknown orientation: ' + orientation + '.');
        }
    }

    /**
     * @param {File} file
     * @returns {Promise<ArrayBuffer>}
     * @private
     */
    _readFileToArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onloadend = progressEvent => {
                try {
                    resolve(progressEvent.target.result);
                } catch (error) {
                    reject(error);
                }
            };
            fileReader.readAsArrayBuffer(file);
        });
    }

    /**
     * @param {DataView} dataView
     * @returns {number|undefined} A number between 1 and 8, or undefined if not found.
     *          In case of undefined, 1 (no rotation) should be assumed.
     */
    _getOrientationValueFromJpegData(dataView) {
        const exifStartUInt16 = 0xFFE1;
        const orientationTagUInt16 = 0x0112;
        const intelFormatLittleEndianIndicator = 0x4949; /* ...and the motorola format is 0x4D4D */

        const exifStartIndex = this._findUInt16InDataView(dataView, exifStartUInt16, {start: 2});
        if (exifStartIndex !== undefined) {
            const isLittleEndian = dataView.getUint16(exifStartIndex + 10) === intelFormatLittleEndianIndicator;
            const exifEndIndex = (exifStartIndex + 2) + dataView.getUint16(exifStartIndex + 2, isLittleEndian);

            const orientationTagIndex = this._findUInt16InDataView(dataView, orientationTagUInt16, {start: exifStartIndex + 12, end: exifEndIndex, isLittleEndian});
            if (orientationTagIndex !== undefined) {
                return dataView.getUint16(orientationTagIndex + 8, isLittleEndian);
            }
        }
        return undefined;
    }

    /**
     * @param {ArrayBuffer} data
     * @param {DataView} dataView
     * @returns {boolean}
     * @private
     */
    _isJpegFile(data, dataView) {
        return (data.byteLength >= 2) && dataView.getUint16(0) === 0xFFD8;
    }

    /**
     * @param {DataView} dataView
     * @param {number} search Two bytes. E.g. 0xFFE1
     * @param {int} [start] Default: 0
     * @param {int} [end] Default: search till the end of the data
     * @param {boolean} [isLittleEndian] Default: false
     * @returns {number|undefined} The byteIndex of "search" in the data, or undefined if not found.
     */
    _findUInt16InDataView(dataView, search, {start = 0, end = dataView.byteLength, isLittleEndian = false} = {}) {
        let index = start;
        while (index < end - 2) {
            if (dataView.getUint16(index, isLittleEndian) === search) {
                return index;
            }
            index += 2;
        }
        return undefined;
    }
}