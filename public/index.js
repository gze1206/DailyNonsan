var indexVue = null;

$(() => {
    initVue();
})

function initVue() {
    if (indexVue == null) {
        indexVue = new Vue({
            el: "#main",
            data: {}
        });
    }
}

/**
 * 
 * @param {'page1' | 'page2' | 'all'} type 
 */
function SendLetter(type) {
    $.ajax({
        url: `/api/send/${type}`,
        type: 'post',
        dataType: 'text',
        success: function (data) {
            ShowNotify('success', 'Send', 'REQUEST COMPLETE!');
        },
        error: function (request, status, error) {   // 오류가 발생했을 때 호출된다. 
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            ShowNotify('error', 'Send', `FAILED!\r\n${request.responseText}`);
        },
    });
}