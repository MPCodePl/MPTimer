export class GuidUtils {
    public static generateGuid(): string {
        let result = "";
        let i = "";
        result = '';
        for (let j = 0; j < 32; j++) {
            if ( j == 8 || j == 12 || j == 16 || j == 20) {
                result = result + '-';
            }

            i = Math.floor(Math.random()*16).toString(16).toUpperCase();
            result = result + i;
        }

        return result;
    }
}
