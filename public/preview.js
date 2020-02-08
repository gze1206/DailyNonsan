var previewVue = null;

$(() => {
    initVue();
    // GetPreview('news');
})

function initVue() {
    if (previewVue == null) {
        previewVue = new Vue({
            el: "#main",
            data: {
                content: 'EMPTY!',
            },
        })
    }
}

function GetPreview(name) {
    $.ajax({
        url: `/api/preview/${name}`,
        type: 'get',
        dataType: 'text',
        success: function (data) {
            // console.log('ajax : ', data);
            previewVue.$data.content = data;
            ShowNotify('success', 'Load', 'COMPLETE!');
        },
        error: function (request, status, error) {   // 오류가 발생했을 때 호출된다. 
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            ShowNotify('error', 'Load', `FAILED!\r\n${request.responseText}`);
        },
    });
}