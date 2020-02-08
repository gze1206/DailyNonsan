var settingVue = null;

$(() => {
    initVue();
    getSettings();
})

function initVue() {
    if (settingVue == null) {
        settingVue = new Vue({
            el: "#main",
            data: {
                settings: {},
            },
        })
    }
}

function getSettings() {
    $.ajax({
        url: './settings',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            // console.log('ajax : ', data);
            settingVue.$data.settings = data;
            ShowNotify('success', 'Load', 'COMPLETE!');
        },
        error: function (request, status, error) {   // 오류가 발생했을 때 호출된다. 
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            ShowNotify('error', 'Load', `FAILED!\r\n${request.responseText}`);
        },
    });
}

function postSettings() {
    if (Object.keys(settingVue.$data.settings).length === 0) {
        ShowNotify(null, '???', 'Try again after reload this page');
        return;
    }

    Vue.dialog.confirm("정말 저장하시겠습니까?", { loader: true })
        .then(dialog => {
            const data = {};
            $('input[type="text"]').each((_, iter) => {
                data[$(iter).attr('setting_key')] = $(iter).val();
            });

            console.log(data);
            $.ajax({
                url: './settings',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    // console.log('post success!', data);
                    dialog.close();
                    getSettings();
                    ShowNotify('success', 'Save', 'COMPLETE!');
                }
            });
        })
        .catch(res => {
            // console.log('canceled');
            ShowNotify('warn', 'Save', 'Canceled');
        });
}
