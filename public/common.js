/**
 * 
 * @param {'success' | 'warn' | 'error' | null} type 
 * @param {string} title 
 * @param {string} text 
 */
function ShowNotify(type, title, text) {
    Vue.notify({
        group: 'result',
        type: type,
        title: title,
        text: text,
        duration: 3000
    });
}