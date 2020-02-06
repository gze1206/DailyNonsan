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
            Vue.notify({
                group: 'result',
                title: 'Load',
                text: 'COMPLETE!',
                duration: 3000
            });
        },
        error: function (request, status, error) {   // 오류가 발생했을 때 호출된다. 
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            Vue.notify({
                group: 'result',
                type: 'error',
                title: 'Load',
                text: `FAILED!\r\n${request.responseText}`,
                duration: 3000
            });
        },
    });
}

function postSettings() {
    if (Object.keys(settingVue.$data.settings).length === 0) {
        alert('? Try again after reload this page');
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
                    Vue.notify({
                        group: 'result',
                        title: 'Save',
                        text: 'COMPLETE!',
                        duration: 3000
                    });
                }
            });
        })
        .catch(res => {
            // console.log('canceled');
            Vue.notify({
                group: 'result',
                type: 'warn',
                title: 'Save',
                text: 'Canceled',
                duration: 3000
            });
        });
}
